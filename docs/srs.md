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

* ID
* Name
* Email
* Role
* Password (hashed)

#### SELLER

* ID
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

#### INVOICE

* Invoice ID (PK)
* Item Name (FK)
* Item ID (FK)
* Weight (FK)
* Date of Sale (FK)
* Total Price ((weight * real-time price) + msn3ya)
* Total Price after Tax

## 6. Future roadmap
## 	A. AI Module

* Analyze historical transactions
* Predict demand spikes
* Recommend pricing adjustments

## B. Appendix (yousef remember to remove this if you dont have time)

### Sample Survey Questions (for presentation)

* How often do you update prices?
* What is your msn3ya? (to calculate market avg.)
* What karat is most commonly sold?
* Do you raise seller fees during sales surges?
* What features do you want in a POS?
* What should invoices include?

---

This SRS will serve as a baseline for further design, development, and evaluation of the POS system.
