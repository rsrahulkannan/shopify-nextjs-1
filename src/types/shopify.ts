export interface Product {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    totalInventory: number;
    featuredMedia: {
        mediaContentType: string;
        id: string;
        preview: {
            image: {
                url: string;
            }
        }
    },
    priceRangeV2: {
        maxVariantPrice: {
            amount: string;
        }
    }
}
