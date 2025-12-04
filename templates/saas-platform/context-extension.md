# SaaS Context Extension

# Agregar estas secciones a tu project-context.yml para proyectos SaaS

# -----------------------------------------------------------------------------
# SAAS CONFIGURATION
# -----------------------------------------------------------------------------
saas:
  enabled: true
  
  # Multi-tenancy
  multi_tenancy:
    strategy: "tenant-id"  # tenant-id | database-per-tenant | schema-per-tenant
    tenant_field: "organizationId"
    
  # Billing
  billing:
    provider: "stripe"
    currency: "usd"
    tax_enabled: false
    
  # Plans
  plans:
    - name: "Free"
      id: "free"
      price: 0
      limits:
        users: 3
        storage_gb: 1
        api_calls_monthly: 1000
        
    - name: "Starter"
      id: "starter"
      price: 29
      stripe_price_id: "price_xxx"
      limits:
        users: 10
        storage_gb: 10
        api_calls_monthly: 10000
        
    - name: "Pro"
      id: "pro"
      price: 99
      stripe_price_id: "price_yyy"
      limits:
        users: 50
        storage_gb: 100
        api_calls_monthly: 100000
        
    - name: "Enterprise"
      id: "enterprise"
      price: "custom"
      limits:
        users: "unlimited"
        storage_gb: "unlimited"
        api_calls_monthly: "unlimited"
        
  # Features by plan
  features:
    free:
      - "basic_features"
    starter:
      - "basic_features"
      - "api_access"
      - "email_support"
    pro:
      - "basic_features"
      - "api_access"
      - "priority_support"
      - "advanced_analytics"
      - "custom_branding"
    enterprise:
      - "all_features"
      - "dedicated_support"
      - "sla"
      - "custom_integrations"

# -----------------------------------------------------------------------------
# ORGANIZATION CONFIGURATION
# -----------------------------------------------------------------------------
organizations:
  roles:
    - name: "owner"
      permissions: ["*"]
    - name: "admin"
      permissions: ["read:*", "write:*", "delete:*", "invite:members"]
    - name: "member"
      permissions: ["read:*", "write:own"]
    - name: "viewer"
      permissions: ["read:*"]
      
  invitations:
    expiry_hours: 72
    max_pending: 50
    
  onboarding:
    steps:
      - "create_organization"
      - "invite_team"
      - "configure_settings"
      - "setup_billing"
