# PWA Context Extension

# Agregar estas secciones a tu project-context.yml para proyectos PWA

# -----------------------------------------------------------------------------
# PWA CONFIGURATION
# -----------------------------------------------------------------------------
pwa:
  enabled: true
  
  # Service Worker
  service_worker:
    strategy: "next-pwa"  # next-pwa | workbox | custom
    skip_waiting: true
    client_claim: true
    
  # Caching strategies
  caching:
    static_assets: "CacheFirst"
    api_calls: "NetworkFirst"
    images: "StaleWhileRevalidate"
    fonts: "CacheFirst"
    
  # Offline support
  offline:
    fallback_page: "/offline"
    cache_pages:
      - "/"
      - "/dashboard"
      - "/products"
    indexeddb:
      database_name: "MyAppDB"
      stores:
        - name: "items"
          keyPath: "id"
          indexes: ["syncStatus", "createdAt"]
        - name: "syncQueue"
          keyPath: "id"
          indexes: ["entityType", "createdAt"]
          
  # Push notifications
  push_notifications:
    enabled: true
    vapid_subject: "mailto:admin@example.com"
    
  # Web App Manifest
  manifest:
    name: "Mi Aplicación"
    short_name: "MiApp"
    theme_color: "#3b82f6"
    background_color: "#ffffff"
    display: "standalone"
    orientation: "portrait-primary"
    
  # Installability
  install_prompt:
    show_banner: true
    banner_delay: 30000  # 30 segundos
    
# -----------------------------------------------------------------------------
# SYNC CONFIGURATION
# -----------------------------------------------------------------------------
sync:
  strategy: "background-sync"  # background-sync | periodic-sync | manual
  
  # Background sync
  background_sync:
    tag: "sync-queue"
    max_retention_time: 86400000  # 24 horas en ms
    
  # Periodic sync (si está disponible)
  periodic_sync:
    tag: "periodic-sync"
    min_interval: 3600000  # 1 hora en ms
    
  # Conflict resolution
  conflict_resolution: "server-wins"  # server-wins | client-wins | manual
  
  # Retry configuration
  retry:
    max_attempts: 3
    backoff_factor: 2
    initial_delay: 1000
