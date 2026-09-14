export interface AddReviewRequest {
  rating: number;
  title: string;
  comment: string;
}

/** Body of POST /reviews/add. `images` must be URLs from the upload API. */
export interface CreateReviewRequest {
  productId: string;
  title: string;
  description: string;
  images: string[];
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    productId: string;
    title: string;
    description: string;
    images: string[];
    user_id: string;
    createdAt: string;
  };
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface Review {
  _id: string;
  productId: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
