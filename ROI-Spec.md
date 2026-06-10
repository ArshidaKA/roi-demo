# **Product Specification & Implementation Guide: Restaurant ROI & Operations Tracker**

## **1\. Executive Summary**

The Restaurant ROI & Operations Tracker is a lightweight, founder-centric frontend application designed to sit on top of an ERPNext backend. It solves the critical problem of disconnected data (Excel, WhatsApp, paper) by providing a unified, real-time view of daily business performance, profitability, stock, and staff costs.

The system strips away traditional enterprise ERP complexity, offering restaurant owners a frictionless daily entry flow and immediate, actionable financial visibility. ERPNext serves as the accounting, inventory, and payroll backend, while a custom Frappe app provides the simplified owner-friendly frontend.

## **2\. Business Context & Users**

Small to medium restaurant owners struggle to answer fundamental questions daily: *Are we profitable? What cash is available? What do we owe?*

### **2.1 Target Personas**

* **Restaurant Owner/Founder:** Primary consumer of the Dashboard and ROI Reports. Needs instant visibility into net profit, payback periods, cash flow, and outstanding credit.  
* **Accountant:** Uses the Daily Entry to log revenue, expenses, and reconcile accounts without navigating complex ERP sub-ledgers.  
* **Manager:** Updates daily stock status, logs food wastage, and tracks operational costs.  
* **Investor/Partner:** Relies on the ROI & Reports module to understand performance, EBITDA, and owner/operator profit splits.

## **3\. Technical Architecture & Stack**

* **Frontend Framework:** React (with Hooks: useState, useEffect, useMemo) running as a Custom Page inside Frappe or an SPA.  
* **Styling:** Tailwind CSS (using standard, safe utility classes configured via a central APP\_CONFIG object).  
* **Icons & Visualization:** lucide-react for UI iconography, recharts for charting.  
* **Backend System:** ERPNext / Frappe Framework.  
* **Custom App Name:** restaurant\_roi (keeps custom logic separate, avoids modifying core ERPNext, supports future SaaS models).

## **4\. Core Frontend Modules**

### **4.1 Dashboard**

* **Business Goal:** Instant financial positioning.  
* **Features:** Time filters (Today, Week, Month, Year), top KPI strips (ROI %, Net Revenue, Profit, Cash Outflow), live account balances, outstanding credit banners, and trend charts (Revenue vs Expenses, Cost Breakdown).

### **4.2 Daily Entry (The Core Workflow)**

* **Business Goal:** A frictionless daily data entry form replacing multiple spreadsheets.  
* **Features:**  
  * Date selection and validation.  
  * Revenue split by accounts (Cash, Bank, Partners).  
  * Purchase items (Item, Vendor, Amount, Credit toggle, Settled Amount).  
  * Operations expenses, Royalty/Management fees, and Marketing.  
  * **Split Payments:** For expenses paid from multiple accounts (e.g., Rent paid partly from Cash and Bank), the UI allows users to input amounts across multiple accounts directly within a single expense row. The backend maps these split amounts to the respective payment accounts while aggregating them under the single expense category.
  * Gas expenses split (Staff vs. Store).  
  * Food wastage (Raw vs. Cooked).  
  * **Staff Attendance & Payroll:** Mark staff as Present/Absent/Half-day to dynamically accrue daily wage costs. Log salary settlements (advances/payments).

### **4.3 Payables & Ledgers (Expenses)**

* **Business Goal:** Track unpaid bills and manage cash flow.  
* **Features:** Vendor credit tracking, salary due tracking, partial settlements, aging buckets (Current, 1-30, 31-60, 60+ Days), and status indicators.

### **4.4 Staff & Payroll**

* **Business Goal:** Clear visibility of salary commitments and advances based on actual attendance.  
* **Features:** Accrued wages (MTD) driven by days present, paid this month, outstanding dues, staff list with daily rates, and an interactive settlement modal mapping to specific payment accounts.

### **4.5 Stock & Inventory**

* **Business Goal:** Daily material counting to control food cost and leakage.  
* **Features:** Opening/closing stock status indicators, variance tracking, and detailed consumption/wastage rows by item and UoM.

### **4.6 ROI & Reports**

* **Business Goal:** Enterprise-grade financial reporting presented in an accessible, Excel-like format.  
* **Features:** Monthly P\&L, ROI Summary, Payback Schedule, Vendor Credit Aging, EBITDA approximation, Annualized projections, and Owner/Operator profit splits. Exportable to PDF/Excel.

### **4.7 Aggregators & Debtors**

* **Business Goal:** Track money owed by delivery partners (Deliveroo, Talabat) and B2B corporate accounts.
* **Features:**
  * View pending receivables from partners.
  * **Settlement Flow:** When money hits the bank, users log a settlement.
  * **Commissions:** Users input the "Commission Taken" by the aggregator, which directly hits the Expense account.
  * **Net Deposit:** Users select whether the Net Amount (Gross - Commission) is deposited to Cash or the Bank Account.

## **5\. ERPNext / Frappe Backend Architecture & Mapping**

### **5.1 Core Approach**

Use ERPNext as the accounting, inventory, payroll, and reporting backend. Build a custom Frappe app (restaurant\_roi) as a simple owner-friendly frontend on top of ERPNext. The custom app does not replace ERPNext accounting; it simplifies daily entry and automatically creates or reads ERPNext documents in the background.

### **5.2 Main Frontend Pages to Frappe Features**

| **Frontend Screen** | **Frappe Feature** |

| **Dashboard** | Custom Frappe Page / Workspace |

| **Daily Entry** | Custom DocType (Restaurant Daily Entry) \+ Custom Page |

| **Payables & Ledgers** | Query Report / Script Report |

| **Staff & Payroll** | Custom Page using Employee / Salary data |

| **Stock & Inventory** | Custom Page using Stock Entry / Item data |

| **ROI & Reports** | Script Reports \+ Print Formats |

### **5.3 Daily Entry Posting Logic**

When the user clicks "Save Day", the custom app creates standard ERPNext documents.

* **Revenue:**  
  * *Cash/POS:* POS Invoice or Sales Invoice \+ Payment Entry.  
  * *Bank:* Sales Invoice \+ Payment Entry.  
  * *Delivery Partner:* Sales Invoice / POS Invoice against delivery partner account.  
* **Purchases:**  
  * *Paid:* Purchase Invoice \+ Payment Entry.  
  * *Credit:* Purchase Invoice only (updates Accounts Payable).  
  * *Partial:* Purchase Invoice \+ partial Payment Entry.  
* **OpEx & Expenses:**  
  * *Standard Bills (Rent, Internet):* Purchase Invoice or Journal Entry.  
  * *Gas (Store/Staff):* Journal Entry linked to respective expense accounts.  
  * *Marketing:* Journal Entry (optional Cost Center per campaign).  
  * *Split Payments Workflow:* The frontend allows multiple rows for the same expense (e.g., "Meta Ads" under Marketing). The backend processes these as separate Journal Entries mapped to their respective payment accounts (Cash/Bank) and aggregates them against the common expense account.
* **Fees & Royalties:**  
  * *Franchise/Mgmt Fees:* Purchase Invoice or Journal Entry (Debit: Royalty Expense, Credit: Payable/Bank).  
* **Food Wastage:**  
  * *Raw/Cooked:* Stock Entry (Material Issue) or custom Wastage DocType.  
* **Salary Accrual & Settlements:**  
  * *Accrual:* Journal Entry (Debit: Salary Expense, Credit: Salary Payable) based on daily attendance.
  * *Settlement MVP:* Custom Salary Settlement DocType or Payment Entry against Salary Payable.  
  * *Future HRMS:* Maps to Employee Attendance, Employee Advance, Salary Slip, or Payroll Entry.

### **5.4 Payables, Stock, and Reports Mapping**

* **Payables & Ledgers:** Creates a custom Script Report ("Restaurant Payables Aging") pulling from Purchase Invoice outstanding amounts, Payment Entries, and General Ledger.  
* **Stock:** Pulls Opening Stock from Stock Balance/Bin. Closing/Consumed data creates a Stock Reconciliation or Stock Entry.  
* **Reports:** Handled via Frappe Script Reports and Query Reports. PDF formatting managed by standard Frappe Print Formats.

### **5.5 Suggested Custom DocTypes**

**Must-Have Custom DocTypes:**

* Restaurant Branch: Outlet-level setup.  
* Restaurant Daily Entry: Main daily entry wrapper.  
* Restaurant Revenue Split, Restaurant Purchase Line, Restaurant Expense Line, Restaurant Royalty Line, Restaurant Marketing Line, Restaurant Wastage Line, Restaurant Salary Settlement: Child tables for the Daily Entry.  
* Daily Stock Count & Daily Stock Count Item: Wrapper for daily stock UI.  
* ROI Settings: Investment, sqft, return split, assumptions.

**Optional Custom DocTypes:**

* ROI Projection (Yearly/monthly projections), Investor Return Split, Restaurant Request (Internal workflow), Daily Closure Log (Audit trail).

### **5.6 Standard ERPNext DocTypes Utilized**

* **Core:** Company, Branch/Cost Center, Account, Customer, Supplier, Item, Warehouse.  
* **Billing/Finance:** POS Invoice, Sales Invoice, Purchase Invoice, Payment Entry, Journal Entry, Expense Claim, General Ledger.  
* **Operations:** Stock Entry, Stock Reconciliation.  
* **HR:** Employee, Salary Slip, Payroll.

### **5.7 Server APIs & Flow**

Create Python whitelisted methods to bridge the React frontend and Frappe backend:

* get\_dashboard\_data, get\_daily\_entry, save\_daily\_entry (draft), submit\_daily\_entry (creates ERPNext docs), get\_payables, settle\_payable, get\_stock\_count, submit\_stock\_count, get\_roi\_report.

**Posting Flow Rule:** Final balances should *never* be calculated only from the custom frontend. Final numbers must come from ERPNext accounting ledgers. The Daily Entry acts as an operational wrapper that generates the required GL impact.

## **6\. MVP Implementation Order & Roadmap**

* **Phase 1 — Custom App \+ Daily Entry (Current Status: UI Complete)**  
  * Create custom app (restaurant\_roi).  
  * Create Daily Entry DocType and child tables.  
  * Integrate React/Frappe page.  
  * Save daily entry as draft.  
* **Phase 2 — ERPNext Posting**  
  * Write Python logic to generate Sales Invoices, Purchase Invoices, Payment Entries, Journal Entries, and Stock Entries on submit.  
  * Store ERPNext document references in the custom wrapper.  
* **Phase 3 — Dashboard**  
  * Build KPI API, account balance API, and outstanding credit API pulling from GL.  
  * Wire up revenue/expense/profit charts.  
* **Phase 4 — Staff \+ Stock**  
  * Connect staff salary settlement logic.  
  * Connect daily stock count, food wastage, and stock variance to Item/Bin data.  
* **Phase 5 — ROI Reports**  
  * Build Script Reports for Monthly P\&L, ROI summary, Payback schedule, and Owner/operator split.  
  * Implement Export to PDF/Excel functionality.

## **7\. Summary**

The cleanest setup is:

* **ERPNext:** Accounting, stock, payroll, ledger source of truth.  
* **Custom Frappe App:** Simple restaurant owner frontend.  
* **Daily Entry:** Operational wrapper that creates ERPNext documents.  
* **Reports:** Frappe Script Reports and Print Formats.

This architecture gives the restaurant owner a frictionless, modern interface while maintaining strict, automated ERPNext accounting discipline in the backend. It turns daily restaurant activity into clean financial visibility, better decisions, and investor-ready reports.