import mongoose, { Document, Schema } from "mongoose";

export interface ISettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  businessTagline?: string;
  paypalEnabled: boolean;
  stripeEnabled: boolean;
  cashEnabled: boolean;
  freeDelivery: boolean;
  deliveryFee: number;
  minOrderAmount?: number;
  taxRate?: number;
  currency?: string;
  currencySymbol?: string;
  maintenanceMode?: boolean;
  orderNotificationEmail?: string;
  enableLowStockAlerts?: boolean;
}

export interface ISettingsDocument extends ISettings, Document {}

const settingsSchema = new Schema<ISettingsDocument>(
  {
    storeName: { type: String, default: "Artisan Crumbs" },
    storeEmail: { type: String, default: "hello@artisancrumbs.com" },
    storePhone: { type: String, default: "+1 (555) 123-4567" },
    storeAddress: { type: String, default: "123 Baker Street, NY" },
    businessTagline: { type: String, default: "Handcrafted Fresh Baked Goods & Artisanal Pastries" },
    paypalEnabled: { type: Boolean, default: true },
    stripeEnabled: { type: Boolean, default: true },
    cashEnabled: { type: Boolean, default: false },
    freeDelivery: { type: Boolean, default: true },
    deliveryFee: { type: Number, default: 4.99 },
    minOrderAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 10 },
    currency: { type: String, default: "USD" },
    currencySymbol: { type: String, default: "$" },
    maintenanceMode: { type: Boolean, default: false },
    orderNotificationEmail: { type: String, default: "alerts@artisancrumbs.com" },
    enableLowStockAlerts: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Settings = mongoose.model<ISettingsDocument>("Settings", settingsSchema);

export async function getOrCreateSettings(): Promise<ISettingsDocument> {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

export default Settings;
