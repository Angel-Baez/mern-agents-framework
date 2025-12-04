# Admin Dashboard Context Extension

# Agregar estas secciones a tu project-context.yml para proyectos de admin dashboard

# -----------------------------------------------------------------------------
# ADMIN DASHBOARD CONFIGURATION
# -----------------------------------------------------------------------------
admin_dashboard:
  enabled: true
  
  # Authentication
  auth:
    require_2fa: false
    session_timeout: 3600  # 1 hora
    
  # Roles and permissions
  roles:
    super_admin:
      permissions: ["*"]
    admin:
      permissions:
        - "users:read"
        - "users:write"
        - "products:*"
        - "orders:*"
        - "reports:read"
    editor:
      permissions:
        - "products:read"
        - "products:write"
        - "orders:read"
    viewer:
      permissions:
        - "users:read"
        - "products:read"
        - "orders:read"
        - "reports:read"

  # Dashboard widgets
  widgets:
    - type: "stats_card"
      title: "Total Users"
      entity: "users"
      metric: "count"
    - type: "stats_card"
      title: "Revenue"
      entity: "orders"
      metric: "sum"
      field: "total"
    - type: "chart"
      title: "Orders by Day"
      chart_type: "line"
      entity: "orders"
      group_by: "createdAt"
      period: "7d"
    - type: "table"
      title: "Recent Orders"
      entity: "orders"
      limit: 5
      columns: ["id", "customer", "total", "status", "createdAt"]

  # CRUD configuration
  entities:
    users:
      list:
        columns: ["name", "email", "role", "createdAt"]
        searchable: ["name", "email"]
        filterable: ["role", "isActive"]
        sortable: ["name", "createdAt"]
      form:
        fields:
          - name: "name"
            type: "text"
            required: true
          - name: "email"
            type: "email"
            required: true
          - name: "role"
            type: "select"
            options: ["user", "admin"]
          - name: "isActive"
            type: "switch"
            
    products:
      list:
        columns: ["name", "price", "stock", "category", "isActive"]
        searchable: ["name", "description"]
        filterable: ["category", "isActive"]
        sortable: ["name", "price", "createdAt"]
      form:
        fields:
          - name: "name"
            type: "text"
            required: true
          - name: "description"
            type: "richtext"
          - name: "price"
            type: "number"
            required: true
          - name: "stock"
            type: "number"
          - name: "category"
            type: "relation"
            entity: "categories"
          - name: "images"
            type: "images"
            max: 5

  # Data export
  export:
    formats: ["csv", "xlsx", "json"]
    max_records: 10000
    
  # Audit log
  audit:
    enabled: true
    log_reads: false
    log_writes: true
    retention_days: 90
