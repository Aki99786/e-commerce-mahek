/**
 * Shiprocket tracking API response types
 */

export interface TrackingActivity {
  date: string;
  activity: string;
  location: string;
  sr_status?: string;
}

export interface TrackingData {
  awb_code?: string;
  current_status?: string;
  shipment_track?: TrackingActivity[];
  shipment_track_activities?: TrackingActivity[];
  etd?: string;              // Estimated delivery date
  courier_name?: string;
  delivered_date?: string;
}

export interface TrackOrderResponse {
  orderId: string;
  orderStatus: string;
  awbCode: string | null;
  courierName: string | null;
  shiprocketOrderId: string | null;
  shiprocketShipmentId: string | null;
  trackingData: TrackingData | null;
  message?: string;
}
