# Ecommerce Context Extension

# Agregar estas secciones a tu project-context.yml para proyectos ecommerce

# -----------------------------------------------------------------------------
# ECOMMERCE CONFIGURATION
# -----------------------------------------------------------------------------
ecommerce:
  enabled: true
  
  # Payment providers
  payments:
    primary_provider: "stripe"  # stripe | mercadopago | paypal
    
    stripe:
      enabled: true
      webhook_events:
        - "checkout.session.completed"
        - "payment_intent.succeeded"
        - "payment_intent.payment_failed"
        - "charge.refunded"
        
    mercadopago:
      enabled: false
      country: "AR"  # AR | BR | MX | CL | CO | PE | UY
      
  # Checkout
  checkout:
    type: "hosted"  # hosted | embedded | custom
    guest_checkout: true
    save_payment_method: true
    
  # Shipping
  shipping:
    enabled: true
    providers:
      - name: "standard"
        price: 10
        delivery_days: 5
      - name: "express"
        price: 25
        delivery_days: 2
    free_shipping_threshold: 100
    
  # Tax
  tax:
    enabled: true
    inclusive: false
    default_rate: 21  # Porcentaje
    
  # Inventory
  inventory:
    track_quantity: true
    allow_backorder: false
    low_stock_threshold: 5

# -----------------------------------------------------------------------------
# PRODUCT CONFIGURATION
# -----------------------------------------------------------------------------
products:
  # Attributes
  attributes:
    - name: "size"
      type: "select"
      options: ["XS", "S", "M", "L", "XL"]
    - name: "color"
      type: "select"
      options: ["black", "white", "blue", "red"]
      
  # Categories
  categories:
    max_depth: 3
    
  # Pricing
  pricing:
    currency: "USD"
    decimals: 2
    
  # Images
  images:
    max_per_product: 10
    sizes:
      thumbnail: [150, 150]
      medium: [500, 500]
      large: [1000, 1000]

# -----------------------------------------------------------------------------
# ORDER CONFIGURATION
# -----------------------------------------------------------------------------
orders:
  statuses:
    - "pending"
    - "paid"
    - "processing"
    - "shipped"
    - "delivered"
    - "cancelled"
    - "refunded"
    
  # Notifications
  notifications:
    email:
      - on: "order_placed"
        to: ["customer", "admin"]
      - on: "order_shipped"
        to: ["customer"]
      - on: "order_delivered"
        to: ["customer"]
