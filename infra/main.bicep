// CollabAzure Infra (Bicep)
// NOTE: This is a high-level scaffold. TODO: Split per-module and use AVM modules.

targetScope = 'subscription'

@description('Environment name (e.g., dev, test, prod)')
param environment string

@description('Location for resources')
param location string = deployment().location

@description('Base name prefix')
param baseName string

// Resource group
resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${baseName}-${environment}'
  location: location
  tags: {
    'azd-env-name': environment
  }
}

// Prefer Azure Container Apps (ACA) for hosting web, dms-core, chat-core
// TODO: module containerAppsEnv: Microsoft.App/managedEnvironments
// TODO: modules for container apps with secrets from Key Vault
// TODO: Add Azure Database for PostgreSQL Flexible Server
// TODO: Add Redis, Service Bus, Storage (Blob with immutability/WORM), Key Vault, App Insights/Monitor
// TODO: Add Azure AD B2C app registrations (note: handled outside Bicep via Entra)

output resourceGroupName string = rg.name
