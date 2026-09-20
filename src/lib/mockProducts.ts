export interface ProductVariant {
  colorName: string;
  colorCode: string;
  images: string[];
  sizes: { size: string; price: number; originalPrice?: number; stock: number }[];
}

export interface Product {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  material: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  isNew: boolean;
  popular: boolean;
  variants: ProductVariant[];
  badge?: "Sale" | "New";
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Tokyo Mist Jacket",
    subtitle: "Two-tone nylon jacket built for city adventures.",
    description: "The Tokyo Mist Jacket is engineered for the modern urban explorer. Featuring a water-resistant dual-tone nylon shell, it provides lightweight protection against the elements without compromising on style. The breathable mesh lining ensures comfort during active days, while the hidden pockets keep your essentials secure.",
    material: "100% Recycled Nylon Shell, Polyester Mesh Lining",
    rating: 4.8,
    reviewCount: 124,
    category: "Men",
    brand: "Luxe",
    isNew: true,
    popular: true,
    badge: "Sale",
    variants: [
      {
        colorName: "Mustard",
        colorCode: "bg-yellow-500",
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&q=80",
          "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=1000&q=80",
          "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1000&q=80"
        ],
        sizes: [
          { size: "S", price: 320.00, originalPrice: 380.00, stock: 0 },
          { size: "M", price: 320.00, stock: 5 },
          { size: "L", price: 320.00, stock: 12 },
          { size: "XL", price: 335.00, stock: 2 }
        ]
      },
      {
        colorName: "Navy Blue",
        colorCode: "bg-blue-800",
        images: [
          "https://images.unsplash.com/photo-1551028719-0125fd6b208c?w=1000&q=80",
          "https://images.unsplash.com/photo-1523398002811-999aa8e9f5b9?w=1000&q=80"
        ],
        sizes: [
          { size: "M", price: 320.00, stock: 8 },
          { size: "L", price: 320.00, stock: 4 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Urban Trek Sling",
    subtitle: "Two-tone nylon shoulder bag built for city adventures.",
    description: "Compact yet spacious, the Urban Trek Sling is your perfect daily companion. Wear it across your chest or back for easy access to your belongings. Features weather-resistant zippers and an adjustable padded strap.",
    material: "Cordura® Canvas, YKK Zippers",
    rating: 4.5,
    reviewCount: 89,
    category: "Accessories",
    brand: "Urban",
    isNew: false,
    popular: true,
    badge: "New",
    variants: [
      {
        colorName: "White",
        colorCode: "bg-white",
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&q=80",
          "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=1000&q=80"
        ],
        sizes: [
          { size: "One Size", price: 120.00, stock: 15 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Kyoto Lavender Shirt",
    subtitle: "Subtle gloss finish with an elegant cut stand out, softly.",
    description: "Crafted from a premium silk blend, this shirt features a relaxed fit with a subtle, luxurious sheen. Perfect for both office wear and evening outings.",
    material: "60% Silk, 40% Organic Cotton",
    rating: 4.9,
    reviewCount: 42,
    category: "Men",
    brand: "Luxe",
    isNew: true,
    popular: false,
    variants: [
      {
        colorName: "White",
        colorCode: "bg-white",
        images: [
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=80"
        ],
        sizes: [
          { size: "S", price: 168.00, stock: 4 },
          { size: "M", price: 168.00, stock: 10 },
          { size: "L", price: 175.00, stock: 0 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Black Sea Polo",
    subtitle: "Minimal made polo tee designed for understated confidence.",
    description: "A reimagined classic. The Black Sea Polo utilizes a micro-pique fabric that breathes effortlessly while holding its sharp collar structure all day long.",
    material: "100% Supima Cotton",
    rating: 4.7,
    reviewCount: 215,
    category: "Men",
    brand: "Sea",
    isNew: false,
    popular: true,
    variants: [
      {
        colorName: "Black",
        colorCode: "bg-black",
        images: [
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=80"
        ],
        sizes: [
          { size: "M", price: 190.00, stock: 20 },
          { size: "XL", price: 200.00, stock: 5 }
        ]
      },
      {
        colorName: "Red",
        colorCode: "bg-red-500",
        images: [
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=80"
        ],
        sizes: [
          { size: "M", price: 190.00, stock: 8 },
          { size: "L", price: 190.00, stock: 12 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Osaka Grid Layer",
    subtitle: "Textured navy jacket with a geometric stitch detail smart & sleek.",
    description: "Structured and bold, the Osaka Grid Layer adds instant sophistication to any outfit. The unique geometric stitching provides texture while maintaining a clean silhouette.",
    material: "Wool Blend (70% Wool, 30% Polyester)",
    rating: 4.6,
    reviewCount: 38,
    category: "Women",
    brand: "Luxe",
    isNew: true,
    popular: false,
    variants: [
      {
        colorName: "White",
        colorCode: "bg-white",
        images: [
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&q=80"
        ],
        sizes: [
          { size: "XS", price: 280.00, stock: 2 },
          { size: "S", price: 280.00, stock: 6 }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Street Camo Tee",
    subtitle: "Bold street camo made for modern urban rhythm.",
    description: "An oversized fit t-shirt featuring a custom-designed camouflage pattern. Garment-dyed for a vintage feel that gets softer with every wash.",
    material: "100% Heavyweight Cotton",
    rating: 4.4,
    reviewCount: 512,
    category: "Men",
    brand: "Urban",
    isNew: false,
    popular: true,
    variants: [
      {
        colorName: "Green",
        colorCode: "bg-green-700",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=80"
        ],
        sizes: [
          { size: "L", price: 100.00, stock: 50 },
          { size: "XL", price: 110.00, stock: 35 }
        ]
      }
    ]
  }
];

export const getProductById = (id: string | number) => {
  return mockProducts.find(p => p.id === Number(id));
};

export const mockCategories = [
  { name: "Men's Fashion", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&q=80" },
  { name: "Women's Fashion", image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=300&q=80" },
  { name: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80" },
  { name: "Watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&q=80" },
  { name: "Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80" },
  { name: "Beauty & Care", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80" },
  { name: "Kids Fashion", image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=300&q=80" },
];
