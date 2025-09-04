// Azure Bicep template for scalable database infrastructure

@description('Environment name (dev, staging, prod)')
param environment string = 'prod'

@description('Region for primary deployment')
param primaryRegion string = 'East US 2'

@description('Regions for read replicas')
param replicaRegions array = ['West US 2', 'Europe West', 'Asia Southeast']

// PostgreSQL Cluster for primary data
module postgresCluster 'modules/postgres-cluster.bicep' = {
  name: 'postgres-cluster-${environment}'
  params: {
    environment: environment
    primaryRegion: primaryRegion
    replicaRegions: replicaRegions
    skuName: 'GP_Gen5_32' // 32 vCores for high throughput
    storageSizeGB: 4096 // 4TB storage
    backupRetentionDays: 35
    geoRedundantBackup: 'Enabled'
    autoGrow: 'Enabled'
    
    // High availability configuration
    availabilityZone: '1'
    standbyAvailabilityZone: '2'
    
    // Performance optimization
    connectionPooling: {
      enabled: true
      maxConnections: 2000
      poolMode: 'transaction'
    }
    
    // Read replicas for scaling
    readReplicas: [
      {
        region: 'West US 2'
        skuName: 'GP_Gen5_16'
      }
      {
        region: 'Europe West'  
        skuName: 'GP_Gen5_16'
      }
      {
        region: 'Asia Southeast'
        skuName: 'GP_Gen5_16'
      }
    ]
  }
}

// Redis Cluster for caching and sessions
module redisCluster 'modules/redis-cluster.bicep' = {
  name: 'redis-cluster-${environment}'
  params: {
    environment: environment
    primaryRegion: primaryRegion
    
    // Premium tier for clustering
    skuName: 'Premium'
    skuFamily: 'P'
    skuCapacity: 6 // P6 = 53GB memory
    
    // Clustering configuration
    shardCount: 10 // Distribute load across shards
    replicasPerShard: 1 // High availability
    
    // Performance settings
    maxMemoryPolicy: 'allkeys-lru'
    enableNonSslPort: false
    
    // Geo-replication
    geoReplication: {
      enabled: true
      linkedCaches: [
        {
          location: 'West US 2'
          role: 'Secondary'
        }
        {
          location: 'Europe West'
          role: 'Secondary'  
        }
      ]
    }
  }
}

// MongoDB for document storage
module mongoCluster 'modules/cosmos-mongo.bicep' = {
  name: 'mongo-cluster-${environment}'
  params: {
    environment: environment
    
    // Global distribution
    locations: [
      {
        locationName: primaryRegion
        failoverPriority: 0
        isZoneRedundant: true
      }
      {
        locationName: 'West US 2'
        failoverPriority: 1
        isZoneRedundant: true
      }
      {
        locationName: 'Europe West'
        failoverPriority: 2
        isZoneRedundant: true
      }
    ]
    
    // Performance configuration
    defaultConsistencyLevel: 'Session' // Balance consistency and performance
    maxStalenessPrefix: 100000
    maxIntervalInSeconds: 300
    
    // Throughput settings
    throughput: {
      sharedDatabase: 40000 // 40K RU/s for shared throughput
      collections: [
        {
          name: 'documents'
          throughput: 20000
          partitionKey: '/userId'
        }
        {
          name: 'activities'
          throughput: 15000
          partitionKey: '/timestamp'
        }
      ]
    }
    
    // Backup configuration
    backupPolicy: {
      type: 'Continuous'
      continuousModeProperties: {
        tier: 'Continuous7Days'
      }
    }
  }
}

// Elasticsearch for search and analytics
module elasticsearchCluster 'modules/elasticsearch.bicep' = {
  name: 'elasticsearch-${environment}'
  params: {
    environment: environment
    
    // Node configuration for high availability
    dataNodes: {
      count: 6
      size: 'Standard_D8s_v3' // 8 vCPU, 32GB RAM
      diskSize: 1024 // 1TB per node
    }
    
    masterNodes: {
      count: 3
      size: 'Standard_D4s_v3' // 4 vCPU, 16GB RAM
    }
    
    // Performance optimization
    settings: {
      'indices.memory.index_buffer_size': '40%'
      'indices.memory.min_index_buffer_size': '96mb'
      'thread_pool.search.queue_size': 10000
      'thread_pool.write.queue_size': 10000
    }
    
    // Index templates for optimization
    indexTemplates: [
      {
        name: 'messages-template'
        patterns: ['messages-*']
        settings: {
          number_of_shards: 10
          number_of_replicas: 1
          refresh_interval: '5s'
        }
      }
      {
        name: 'files-template'
        patterns: ['files-*']
        settings: {
          number_of_shards: 5
          number_of_replicas: 1
          refresh_interval: '30s'
        }
      }
    ]
  }
}

// Output connection strings and endpoints
output postgresConnectionString string = postgresCluster.outputs.connectionString
output redisConnectionString string = redisCluster.outputs.connectionString
output mongoConnectionString string = mongoCluster.outputs.connectionString
output elasticsearchEndpoint string = elasticsearchCluster.outputs.endpoint



