export type TenantClaims = {
  tenantId: string; // org
  facilityId?: string;
  roles: string[]; // Admin, Preparer, Signer, Viewer, Dispatcher, Driver
};

export interface ApiClientConfig {
  baseUrl: string;
  getToken: () => Promise<string>;
}

export class ApiClient {
  constructor(private cfg: ApiClientConfig) {}
  // TODO: Replace with OpenAPI generated clients
  async health(): Promise<any> {
    const r = await fetch(`${this.cfg.baseUrl}/health`);
    return r.json();
  }
}
