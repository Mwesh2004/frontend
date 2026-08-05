const API_URL = "http://localhost:5000/api";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return data.products;
}

export async function addProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to add product");
  }

  return await response.json();
}