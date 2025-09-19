import type { Product } from "~~/shared/types";

export const useProductStore = defineStore("products2", () => {
  const products = ref<Product[]>([
    {
      id: 1,
      name: "AI-Powered Smartwatch",
      description:
        "A smartwatch with a built-in AI assistant, fitness tracking, and a sleek design.",
      price: 299.99,
      stock: 150,
      specs: {
        Display: "1.9-inch Always-On Retina LTPO OLED display",
        Resolution: "484 x 396 pixels",
        Processor: "S9 SiP with 64-bit dual-core processor",
        Sensors:
          "Blood oxygen sensor, electrical heart sensor, optical heart sensor, temperature sensor",
        "Water Resistance": "50 meters",
        "Battery Life":
          "Up to 36 hours of normal use, 72 hours in Low Power Mode",
      },
    },
    {
      id: 2,
      name: "Noise-Cancelling Headphones",
      description:
        "Immerse yourself in sound with our new noise-cancelling headphones.",
      price: 199.99,
      stock: 200,
      specs: {
        "Audio Technology":
          "High-fidelity audio with Active Noise Cancellation and Transparency mode",
        Connectivity: "Bluetooth 5.3",
        Microphones:
          "Eight microphones for Active Noise Cancellation, three microphones for voice pickup",
        Battery: "Up to 40 hours of listening time on a single charge",
        Weight: "384.8 grams",
      },
    },
    {
      id: 3,
      name: "Wireless Charging Pad",
      description: "Charge your devices wirelessly with our fast-charging pad.",
      price: 49.99,
      stock: 500,
      specs: {
        Power: "Up to 15W of wireless power",
        Compatibility:
          "Qi-certified devices, including iPhone, AirPods, and Android devices",
        Input: "USB-C",
        Dimensions: "3.54 inches (90 mm) diameter",
        Material: "Anodized aluminum and Alcantara fabric",
      },
    },
  ]);

  function updateProduct(updatedProduct: Product) {
    const index = products.value.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
  }

  return { products, updateProduct };
});
