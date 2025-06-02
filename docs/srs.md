# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to outline the software requirements for a Point-of-Sale (POS) system designed for gold and jewlery shops. it's main purpose is to tackle rapid price fluctuations in the gold market, allowing sellers to adjust prices dynamically based on real-time data,minimizing losses due to innacurte pricing, it includes inventory management, sales and purchase handling, admin and seller roles, QR-encoded inventory tracking,automatic price calculation,and analytics for decision-making.

### 1.2 Scope

The system will make use of microservices and cloud hosting to allow sellers to scan and manage inventory via QR codes, handle purchases and sales, and generate invoices. Admin users can manage and evaluate sellers, adjust fees (msn3ya), view statistics, and export data. AI recommendations will support pricing and demand forecasting are a possible future feature.

### 1.3 Definitions and Acronyms

* **POS**: Point of Sale
* **QR**: Quick Response (code)
* **MSN3YA**: Seller/manufacturing fee
* **DB**: Database
* **ADMIN**: owner/merchant of the store
* **SELLER**: the employee who handles sales and purchases

## 2. Overall Description

### 2.1 User Classes and Characteristics

* **Admin**: Full access to the system; can manage sellers, inventory, fees, and access all seller data.
* **Seller**: Limited access; can buy/sell items, view inventory, and generate invoices.

### 2.2 Product Functions

* Login and authentication for admin and sellers
* QR encoding and decoding for item tracking
* Buy and sell item workflows with dynamic pricing
* Invoice generation and export
* Inventory management and status overview
* Admin dashboard with seller performance metrics and graphs

### 2.3 Constraints

* Web-based interface (React + MUI + TypeScript)
* Database with MongoDB(nosql)
* Secure authentication and role-based access
* Real-time price fetching based on market rate(from external API)

### 2.4 Assumptions and Dependencies

* External APIs for market rate
* Admin-defined fees (msn3ya)
* QR scanner support via webcam or scanner device

## 3. System Features

### 3.1 Architecture
* Microservice based architecture
* Cloud hosting (AWS)
* Dockerized services for scalability
* Role-based login

### 3.2 Admin Page

* Navigation to management/seller views
* Seller performance stats (DB Fetch)
* Seller account management (Add/Edit/Delete)
* Modify msn3ya (fixed fee)
* Inventory management (CRUD)
* Export data (Excel)
* Dashboard graphs
* Settings page

### 3.3 Seller Page

* **Buy Page**

  * Invoice creation
  * View scanned data from QR/manual input:

    * Item ID, Name, Type, Weight, Karat, Price (auto), Customer name, Date, Total price (price after tax)
* **Sell Page**

  * Similar to Buy Page with adjusted values for sale
* **Inventory View**

  * View available items
  * QR code encoder
* **Transaction Data Entry**

  * Manual entry/edit if needed
* **Invoice Generation**
  * Generate and print invoices
  * Include seller ID, customer info, item details, total price, and date

## 4. External Interface Requirements

### 4.1 User Interface

* Built with React + MUI
* Responsive design for web access

### 4.2 Hardware Interface

* QR code reader (webcam support or external scanner)

### 4.3 Software Interface

* External API for market rates
* MongoDB database access via Mongoose

### 4.4 Communications Interface

* HTTP as this is an MVP

## 5. Database Design

### Entities

#### ADMIN

* ID (PK)
* Name
* Email
* Role
* Password (hashed) ((we are aware this is still not secure, but this is an MVP))

#### SELLER

* ID (PK)
* Name
* Email
* Role
* Date of hire
* Transactions (FK)

#### ITEM (INVENTORY)

* Item ID (PK)
* Category
* Name
* Type
* Weight
* Karat (enum: 24K, 21K, 18K, 14K)
* Origin
* Buy Price
* Vendor Info:

  * Vendor Type (wholesale/etc)
  * Contact Info

#### TRANSACTION

* Item ID (FK)
* Date of Sale
* Price at time of sale (API dependent)
* MSN3YA (fee)
* Payment Type (Cash/Visa)
* Invoice ID (FK)
* Current Tax

## 6. Future roadmap
## 	A. AI model

* Analyze historical transactions
* Predict demand spikes
* Recommend pricing adjustments

# Appendix

### requirment elicitation

#### We shall conduct surveys with gold stores to gather information on their current practices, challenges, and needs. The survey will include the questions:
* How many times a day do you fetch and update market prices?
* What is your msn3ya? (to calculate market avg.)
* how often do you change it?
* Do you surge msn3ya based on seasonal demand?
	- if yes, by how much?
* how do you currently track sales and inventory?
	- paper records
	- software (pos)
	- if not using software, why?
* What methods do you use to track inventory?
	- QR/bar code
	- Manual entry
	- Other (please specify)
* if present, which of these features would you use in a POS?
	 - Real-time price updates
	 - daily/weekly/monthly reports
	 - alerts for low-stock items
	 - would you rely on a QR/barcode system for inventory tracking?
	 - easy adjustment of msn3ya
	 - ability to export data to Excel
* Do your invoices include:
	- Seller name/id who authorized transaction
	- Customer name
	- Customer contact info
	- tax rate
	- msn3ya
	- market rate at time of sale
* Do you want to track customer data?
* Do Customers usually request digital invoices?
* if currently using software, what do you dislike about it?
---

This SRS will serve as a baseline for further design, development, and evaluation of the POS system.
