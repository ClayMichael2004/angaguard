export interface TelemetryPacket {
  device_uid: string;
  kiln_id: string;
  coop_id: string;
  farmer_phone: string;
  initial_height_cm: number;
  final_height_cm: number;
  peak_outer_temp_c: number;
  core_est_temp_c?: number;
  duration_minutes: number;
  heating_rate: number;
  latitude?: number;
  longitude?: number;
  cell_tower_id?: string;
  firmware_version?: string;
  timestamp?: string;
}

export interface MintResult {
  asset_id: string;
  batch_id: string;
  kiln_id: string;
  coop_id: string;
  farmer_phone: string;
  biochar_yield_kg: number;
  gross_co2e_kg: number;
  net_metric_tons_co2e: number;
  carbonmark_market_usd: number;
  market_price_per_ton: number;
  farmer_payout_ksh: number;
  coop_payout_ksh: number;
  platform_fee_usd: number;
  kenya_ncr_tracking_id: string;
  is_validated: boolean;
  rejection_reason?: string;
  verification_hash: string;
  created_at: string;
}

export interface LedgerBlock {
  index: number;
  timestamp: string;
  previous_hash: string;
  block_hash: string;
  merkle_root: string;
  asset: MintResult;
  validator_sig: string;
}

export interface Cooperative {
  id: string;
  name: string;
  region: string;
  center_lat: number;
  center_lng: number;
  radius_km: number;
  allowed_towers: string[];
  registered_kilns: string[];
  farmer_count: number;
  total_biochar_kg: number;
  total_offsets_tons: number;
}

export interface FarmerAccount {
  phone: string;
  name: string;
  national_id: string;
  coop_id: string;
  registered_kiln: string;
  total_burns: number;
  total_biochar_kg: number;
  available_ksh: number;
  total_withdrawn_ksh: number;
  preferred_language: string;
  created_at: string;
}

export interface SMEProfile {
  id: string;
  company_name: string;
  location: string;
  industry: string;
  scope1_diesel_liters: number;
  scope2_grid_kwh: number;
  scope3_offsets_tons: number;
  associated_coops: string[];
  created_at: string;
}

export interface ESGScorecard {
  sme_id: string;
  company_name: string;
  reporting_period: string;
  scope1_direct_tons: number;
  scope2_indirect_tons: number;
  gross_emissions_tons: number;
  scope3_mitigation_tons: number;
  net_carbon_footprint: number;
  grade: 'A+' | 'A' | 'B' | 'C';
  recommendations: string[];
  issb_compliance_hash: string;
  generated_at: string;
}

export interface PayoutRecord {
  transaction_id: string;
  asset_id: string;
  recipient: string;
  recipient_type: 'FARMER' | 'COOPERATIVE';
  amount_ksh: number;
  status: string;
  mpesa_receipt: string;
  timestamp: string;
}

export interface OracleStats {
  total_blocks_minted: number;
  total_net_co2e_tons: number;
  total_biochar_kg: number;
  total_market_value_usd: number;
  total_farmer_payout_ksh: number;
  active_smart_kilns: number;
  registered_farmers: number;
  active_cooperatives: number;
  verified_ncr_registry: string;
}
