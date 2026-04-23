export interface AddReviewRequest {
  rating: number;
  title: string;
  comment: string;
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
