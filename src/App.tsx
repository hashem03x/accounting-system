import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import paths from "@/utils/constants/paths";
import roles from "@/utils/constants/roles";
import resources from "@/utils/constants/resources";
import actions from "@/utils/constants/actions";

// Routing Pages
import Layout from "@/pages/routes/layout";
import HomeLayout from "@/pages/routes/layout-home";
import AdminLayout from "@/pages/routes/layout-admin";
import NotFound from "@/pages/routes/not-found";
import AuthGaurd from "@/pages/routes/auth-gaurd";
import RoleGuard from "@/pages/routes/role-guard";
import ResourceGuard from "@/pages/routes/resource-guard";

// Outer Pages
import Login from "@/pages/outer/login";
import Register from "@/pages/outer/register";
import ForgotPassword from "@/pages/outer/forgot-password";
import VerifyCode from "@/pages/outer/verify-code";
import ResetPassword from "@/pages/outer/reset-password";

// Public Pages
import Home from "@/pages/public/home";
import Categories from "@/pages/public/categories";
import Category from "@/pages/public/categories/[id]";
import Products from "@/pages/public/products";
import Product from "@/pages/public/products/[id]";
import Wishlist from "@/pages/public/wishlist";
import Cart from "@/pages/public/cart";
import ContactUs from "@/pages/public/contact-us";
import TermsAndConditions from "@/pages/public/terms-and-conditions";
import PrivacyPolicy from "@/pages/public/privacy-policy";

// Inner Pages
import Profile from "@/pages/inner/profile";
import Checkout from "@/pages/inner/checkout";
import ConfirmOrder from "@/pages/inner/confirm-order";
import OrderReceived from "./pages/inner/order-received";
import PaymentStatus from "@/pages/inner/payment-status";
import Orders from "@/pages/inner/orders";
import Order from "@/pages/inner/orders/[id]";

// Admin Panel Pages
import Admin from "@/pages/admin";
import AP_Home from "@/pages/admin/home";
import AP_Vendors from "@/pages/admin/home/vendors";
import AP_Vendor from "@/pages/admin/home/vendors/[id]";
import AP_PurchaseOrders from "@/pages/admin/home/purchase-orders";
import AP_PurchaseOrder from "@/pages/admin/home/purchase-orders/[id]";
import AP_NewPurchaseOrder from "@/pages/admin/home/purchase-orders/new";
import AP_Products from "@/pages/admin/home/products";
import AP_Product from "@/pages/admin/home/products/[id]";
import AP_Variants from "@/pages/admin/home/products/variants";
import AP_Variant from "@/pages/admin/home/products/variants/[id]";
import AP_NewProduct from "@/pages/admin/home/products/new";
import AP_SalesOrders from "@/pages/admin/home/sales-orders";
import AP_SalesOrder from "@/pages/admin/home/sales-orders/[id]";
import AP_NewSalesOrder from "@/pages/admin/home/sales-orders/new";
import AP_Customers from "@/pages/admin/home/customers";
import AP_Customer from "@/pages/admin/home/customers/[id]";
import AP_Expenses from "@/pages/admin/home/expenses";
import AP_Warehouses from "@/pages/admin/home/warehouses";
import AP_Transfers from "@/pages/admin/home/transfers";
import AP_Transfer from "@/pages/admin/home/transfers/[id]";
import AP_Reports from "@/pages/admin/reports";
import AP_VendorsReport from "@/pages/admin/reports/vendors";
import AP_CustomersReport from "@/pages/admin/reports/customers";
import AP_PurchaseOrdersReport from "@/pages/admin/reports/purchase-orders";
import AP_SalesOrdersReport from "@/pages/admin/reports/sales-orders";
import AP_ProductsReport from "@/pages/admin/reports/products";
import AP_InventoryTransferReport from "@/pages/admin/reports/inventory-transfer";
import AP_InventorySummaryReport from "@/pages/admin/reports/inventory-summary";
import AP_ExpensesReport from "@/pages/admin/reports/expenses";
import AP_PaymentsReport from "@/pages/admin/reports/payments";
import AP_VariantHistoryReport from "@/pages/admin/reports/variant-history";
import AP_TreasuryBalanceReport from "@/pages/admin/reports/treasury-balance";
import AP_ProfitBySalesReport from "@/pages/admin/reports/profit-by-sales";
import AP_ProfitByCustomerReport from "@/pages/admin/reports/profit-by-customer";
import AP_ProfitByProductReport from "@/pages/admin/reports/profit-by-product";
import AP_Cash from "@/pages/admin/cash";
import AP_Currencies from "@/pages/admin/currencies";
import AP_Categories from "@/pages/admin/categories";
import AP_Coupons from "@/pages/admin/coupons";
import AP_Customization from "@/pages/admin/customization";
import AP_Governorates from "@/pages/admin/governorates";
import AP_Transactions from "@/pages/admin/transactions";
import AP_Transaction from "@/pages/admin/transactions/[id]";
import AP_Users from "@/pages/admin/users";
import AP_User from "@/pages/admin/users/[id]";
import ReturnsReport from "@/pages/admin/reports/returns";
import IncomeStatementReport from "@/pages/admin/reports/income-statement";
import AP_FixedAssets from "@/pages/admin/fixed-assets";
import AP_FixedAssetsReport from "@/pages/admin/reports/fixed-assets";
import AP_BalanceSheetReport from "@/pages/admin/reports/balance-sheet";
import AP_Analytics from "@/pages/admin/analytics";
import AP_ShopifySync from "@/pages/admin/shopify-sync";
import VariantTransactions from "@/pages/admin/variants/transactions";

// Components
import FacebookPixel from "@/components/global/facebook-pixel";

export default function App() {
  // return (
  //   <Router>
  //     <FacebookPixel />
  //     <Routes>
  //       <Route element={<Layout />}>
  //         <Route index element={<Maintenance />} />

  //         {/* Home Layout Pages */}
  //         <Route element={<HomeLayout />}>
  //           {/* Outer Pages (Pages that require user to be logged out) */}
  //           <Route element={<AuthGaurd requireLoggedIn={false} />}>
  //             <Route path={paths.login} element={<Login />} />
  //             <Route path={paths.register} element={<Register />} />
  //             <Route path={paths.forgotPassword} element={<ForgotPassword />} />
  //             <Route path={paths.verifyCode} element={<VerifyCode />} />
  //             <Route path={paths.resetPassword} element={<ResetPassword />} />
  //           </Route>

  //           {/* Inner Pages (Pages that require user to be logged in) */}
  //           <Route element={<AuthGaurd requireLoggedIn={true} />}>
  //             <Route path={paths.profile} element={<Profile />} />
  //           </Route>

  //           {/* Catch All */}
  //           <Route path="*" element={<NotFound />} />
  //         </Route>

  //         {/* Admin Layout Pages (Pages that require user to be admin or moderator) */}
  //         <Route element={<AuthGaurd requireLoggedIn={true} />}>
  //           <Route element={<RoleGuard allowedRoles={[roles.admin.value, roles.moderator.value, roles.operator.value]} />}>
  //             <Route element={<AdminLayout />}>
  //               <Route path={paths.admin} element={<Admin />}>
  //                 <Route path={paths.home}>
  //                   <Route index element={<AP_Home />} />
  //                   <Route element={<ResourceGuard resource={resources.vendors} action={actions.read} />}>
  //                     <Route path={paths.vendors} element={<AP_Vendors />} />
  //                     <Route path={paths.vendors + "/:id"} element={<AP_Vendor />} />
  //                   </Route>
  //                   <Route element={<ResourceGuard resource={resources.purchaseOrders} action={actions.read} />}>
  //                     <Route path={paths.purchaseOrders} element={<AP_PurchaseOrders />} />
  //                     <Route path={paths.purchaseOrders + "/:id"} element={<AP_PurchaseOrder />} />
  //                     <Route element={<ResourceGuard resource={resources.purchaseOrders} action={actions.create} />}>
  //                       <Route path={paths.purchaseOrders + "/" + paths.new} element={<AP_NewPurchaseOrder />} />
  //                     </Route>
  //                   </Route>
  //                   <Route element={<ResourceGuard resource={resources.products} action={actions.read} />}>
  //                     <Route path={paths.products} element={<AP_Products />} />
  //                     <Route path={paths.products + "/:id"} element={<AP_Product />} />
  //                     <Route path={paths.products + "/" + paths.variants} element={<AP_Variants />} />
  //                     <Route path={paths.products + "/" + paths.variants + "/:code"} element={<AP_Variant />} />
  //                     <Route element={<ResourceGuard resource={resources.products} action={actions.create} />}>
  //                       <Route path={paths.products + "/" + paths.new} element={<AP_NewProduct />} />
  //                     </Route>
  //                   </Route>

  //                   {/* Sales orders (read) routes are not protected by the ResourceGuard component */}
  //                   <Route path={paths.salesOrders} element={<AP_SalesOrders />} />
  //                   <Route path={paths.salesOrders + "/:id"} element={<AP_SalesOrder />} />
  //                   <Route element={<ResourceGuard resource={resources.salesOrders} action={actions.create} />}>
  //                     <Route path={paths.salesOrders + "/" + paths.new} element={<AP_NewSalesOrder />} />
  //                   </Route>

  //                   {/* Customers (read) routes are not protected by the ResourceGuard component */}
  //                   <Route path={paths.customers} element={<AP_Customers />} />
  //                   <Route path={paths.customers + "/:id"} element={<AP_Customer />} />

  //                   {/* Expenses (read) route is not protected by the ResourceGuard component */}
  //                   <Route path={paths.expenses} element={<AP_Expenses />} />

  //                   <Route element={<ResourceGuard resource={resources.warehouses} action={actions.read} />}>
  //                     <Route path={paths.warehouses} element={<AP_Warehouses />} />
  //                   </Route>
  //                   <Route element={<ResourceGuard resource={resources.transfers} action={actions.read} />}>
  //                     <Route path={paths.transfers} element={<AP_Transfers />} />
  //                     <Route path={paths.transfers + "/:id"} element={<AP_Transfer />} />
  //                   </Route>

  //                   <Route path={paths.variantTransactions + "/:variantCode"} element={<VariantTransactions />} />
  //                 </Route>

  //                 <Route element={<ResourceGuard resource={resources.reports} action={actions.read} />}>
  //                   <Route path={paths.reports} element={<AP_Reports />} />
  //                   <Route path={`${paths.reports}/${paths.vendors}`} element={<AP_VendorsReport />} />
  //                   <Route path={`${paths.reports}/${paths.customers}`} element={<AP_CustomersReport />} />
  //                   <Route path={`${paths.reports}/${paths.purchaseOrders}`} element={<AP_PurchaseOrdersReport />} />
  //                   <Route path={`${paths.reports}/${paths.salesOrders}`} element={<AP_SalesOrdersReport />} />
  //                   <Route path={`${paths.reports}/${paths.products}`} element={<AP_ProductsReport />} />
  //                   <Route path={`${paths.reports}/${paths.inventoryTransfer}`} element={<AP_InventoryTransferReport />} />
  //                   <Route path={`${paths.reports}/${paths.inventorySummary}`} element={<AP_InventorySummaryReport />} />
  //                   <Route path={`${paths.reports}/${paths.expenses}`} element={<AP_ExpensesReport />} />
  //                   <Route path={`${paths.reports}/${paths.payments}`} element={<AP_PaymentsReport />} />
  //                   <Route path={`${paths.reports}/${paths.variantHistory}`} element={<AP_VariantHistoryReport />} />
  //                   <Route path={`${paths.reports}/${paths.treasuryBalance}`} element={<AP_TreasuryBalanceReport />} />
  //                   <Route path={`${paths.reports}/${paths.profitBySales}`} element={<AP_ProfitBySalesReport />} />
  //                   <Route path={`${paths.reports}/${paths.profitByCustomer}`} element={<AP_ProfitByCustomerReport />} />
  //                   <Route path={`${paths.reports}/${paths.profitByProduct}`} element={<AP_ProfitByProductReport />} />
  //                   <Route path={`${paths.reports}/${paths.returns}`} element={<ReturnsReport />} />
  //                   <Route path={`${paths.reports}/${paths.fixedAssets}`} element={<AP_FixedAssetsReport />} />
  //                   <Route path={`${paths.reports}/${paths.balanceSheet}`} element={<AP_BalanceSheetReport />} />
  //                   <Route path={`${paths.reports}/${paths.incomeStatement}`} element={<IncomeStatementReport />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.cash} action={actions.read} />}>
  //                   <Route path={paths.cash} element={<AP_Cash />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.currencies} action={actions.read} />}>
  //                   <Route path={paths.currencies} element={<AP_Currencies />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.categories} action={actions.read} />}>
  //                   <Route path={paths.categories} element={<AP_Categories />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.coupons} action={actions.read} />}>
  //                   <Route path={paths.coupons} element={<AP_Coupons />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.customization} action={actions.read} />}>
  //                   <Route path={paths.customization} element={<AP_Customization />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.governorates} action={actions.read} />}>
  //                   <Route path={paths.governorates} element={<AP_Governorates />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.transactions} action={actions.read} />}>
  //                   <Route path={paths.transactions} element={<AP_Transactions />} />
  //                   <Route path={paths.transactions + "/:id"} element={<AP_Transaction />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.users} action={actions.read} />}>
  //                   <Route path={paths.users} element={<AP_Users />} />
  //                   <Route path={paths.users + "/:id"} element={<AP_User />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.fixedAssets} action={actions.read} />}>
  //                   <Route path={paths.fixedAssets} element={<AP_FixedAssets />} />
  //                 </Route>
  //                 <Route element={<ResourceGuard resource={resources.analytics} action={actions.read} />}>
  //                   <Route path={paths.analytics} element={<AP_Analytics />} />
  //                 </Route>
  //               </Route>

  //               {/* Catch All Admin Routes */}
  //               <Route path={paths.admin + "/*"} element={<NotFound />} />
  //             </Route>
  //           </Route>
  //         </Route>
  //       </Route>
  //     </Routes>
  //   </Router>
  // );

  return (
    <Router>
      <FacebookPixel />
      <Routes>
        <Route element={<Layout />}>
          {/* Home Layout Pages */}
          <Route element={<HomeLayout />}>
            {/* Public Pages (Pages that are accessible to everyone) */}
            <Route index element={<Home />} />
            <Route path={paths.categories} element={<Categories />} />
            <Route path={paths.categories + "/:id"} element={<Category />} />
            <Route path={paths.products} element={<Products />} />
            <Route path={paths.products + "/:id"} element={<Product />} />
            <Route path={paths.contact} element={<ContactUs />} />
            <Route path={paths.terms} element={<TermsAndConditions />} />
            <Route path={paths.policy} element={<PrivacyPolicy />} />
            {/* The following routes can't be accessed by admins, moderators or representatives */}
            <Route element={<RoleGuard allowedRoles={[roles.user.value]} />}>
              <Route path={paths.wishlist} element={<Wishlist />} />
              <Route path={paths.cart} element={<Cart />} />
              <Route path={paths.checkout} element={<Checkout />} />
            </Route>

            {/* Outer Pages (Pages that require user to be logged out) */}
            <Route element={<AuthGaurd requireLoggedIn={false} />}>
              <Route path={paths.login} element={<Login />} />
              <Route path={paths.register} element={<Register />} />
              <Route path={paths.forgotPassword} element={<ForgotPassword />} />
              <Route path={paths.verifyCode} element={<VerifyCode />} />
              <Route path={paths.resetPassword} element={<ResetPassword />} />
            </Route>

            {/* Inner Pages (Pages that require user to be logged in) */}
            <Route element={<AuthGaurd requireLoggedIn={true} />}>
              <Route path={paths.profile} element={<Profile />} />
              {/* The following routes can't be accessed by admins, moderators or representatives */}
              <Route element={<RoleGuard allowedRoles={[roles.user.value]} />}>
                <Route path={paths.orders} element={<Orders />} />
                <Route path={paths.orders + "/:id"} element={<Order />} />
                <Route path={paths.confirmOrder} element={<ConfirmOrder />} />
                <Route path={paths.orderReceived} element={<OrderReceived />} />
                <Route path={paths.paymentStatus} element={<PaymentStatus />} />
              </Route>
            </Route>

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Layout Pages (Pages that require user to be admin or moderator) */}
          <Route element={<AuthGaurd requireLoggedIn={true} />}>
            <Route element={<RoleGuard allowedRoles={[roles.admin.value, roles.moderator.value, roles.operator.value]} />}>
              <Route element={<AdminLayout />}>
                <Route path={paths.admin} element={<Admin />}>
                  <Route path={paths.home}>
                    <Route index element={<AP_Home />} />
                    <Route element={<ResourceGuard resource={resources.vendors} action={actions.read} />}>
                      <Route path={paths.vendors} element={<AP_Vendors />} />
                      <Route path={paths.vendors + "/:id"} element={<AP_Vendor />} />
                    </Route>
                    <Route element={<ResourceGuard resource={resources.purchaseOrders} action={actions.read} />}>
                      <Route path={paths.purchaseOrders} element={<AP_PurchaseOrders />} />
                      <Route path={paths.purchaseOrders + "/:id"} element={<AP_PurchaseOrder />} />
                      <Route element={<ResourceGuard resource={resources.purchaseOrders} action={actions.create} />}>
                        <Route path={paths.purchaseOrders + "/" + paths.new} element={<AP_NewPurchaseOrder />} />
                      </Route>
                    </Route>
                    <Route element={<ResourceGuard resource={resources.products} action={actions.read} />}>
                      <Route path={paths.products} element={<AP_Products />} />
                      <Route path={paths.products + "/:id"} element={<AP_Product />} />
                      <Route path={paths.products + "/" + paths.variants} element={<AP_Variants />} />
                      <Route path={paths.products + "/" + paths.variants + "/:code"} element={<AP_Variant />} />
                      <Route element={<ResourceGuard resource={resources.products} action={actions.create} />}>
                        <Route path={paths.products + "/" + paths.new} element={<AP_NewProduct />} />
                      </Route>
                    </Route>

                    {/* Sales orders (read) routes are not protected by the ResourceGuard component */}
                    <Route path={paths.salesOrders} element={<AP_SalesOrders />} />
                    <Route path={paths.salesOrders + "/:id"} element={<AP_SalesOrder />} />
                    <Route element={<ResourceGuard resource={resources.salesOrders} action={actions.create} />}>
                      <Route path={paths.salesOrders + "/" + paths.new} element={<AP_NewSalesOrder />} />
                    </Route>

                    {/* Customers (read) routes are not protected by the ResourceGuard component */}
                    <Route path={paths.customers} element={<AP_Customers />} />
                    <Route path={paths.customers + "/:id"} element={<AP_Customer />} />

                    {/* Expenses (read) route is not protected by the ResourceGuard component */}
                    <Route path={paths.expenses} element={<AP_Expenses />} />

                    <Route element={<ResourceGuard resource={resources.warehouses} action={actions.read} />}>
                      <Route path={paths.warehouses} element={<AP_Warehouses />} />
                    </Route>
                    <Route element={<ResourceGuard resource={resources.transfers} action={actions.read} />}>
                      <Route path={paths.transfers} element={<AP_Transfers />} />
                      <Route path={paths.transfers + "/:id"} element={<AP_Transfer />} />
                    </Route>

                    <Route path={paths.variantTransactions + "/:variantCode"} element={<VariantTransactions />} />
                  </Route>

                  <Route element={<ResourceGuard resource={resources.reports} action={actions.read} />}>
                    <Route path={paths.reports} element={<AP_Reports />} />
                    <Route path={`${paths.reports}/${paths.vendors}`} element={<AP_VendorsReport />} />
                    <Route path={`${paths.reports}/${paths.customers}`} element={<AP_CustomersReport />} />
                    <Route path={`${paths.reports}/${paths.purchaseOrders}`} element={<AP_PurchaseOrdersReport />} />
                    <Route path={`${paths.reports}/${paths.salesOrders}`} element={<AP_SalesOrdersReport />} />
                    <Route path={`${paths.reports}/${paths.products}`} element={<AP_ProductsReport />} />
                    <Route path={`${paths.reports}/${paths.inventoryTransfer}`} element={<AP_InventoryTransferReport />} />
                    <Route path={`${paths.reports}/${paths.inventorySummary}`} element={<AP_InventorySummaryReport />} />
                    <Route path={`${paths.reports}/${paths.expenses}`} element={<AP_ExpensesReport />} />
                    <Route path={`${paths.reports}/${paths.payments}`} element={<AP_PaymentsReport />} />
                    <Route path={`${paths.reports}/${paths.variantHistory}`} element={<AP_VariantHistoryReport />} />
                    <Route path={`${paths.reports}/${paths.treasuryBalance}`} element={<AP_TreasuryBalanceReport />} />
                    <Route path={`${paths.reports}/${paths.profitBySales}`} element={<AP_ProfitBySalesReport />} />
                    <Route path={`${paths.reports}/${paths.profitByCustomer}`} element={<AP_ProfitByCustomerReport />} />
                    <Route path={`${paths.reports}/${paths.profitByProduct}`} element={<AP_ProfitByProductReport />} />
                    <Route path={`${paths.reports}/${paths.returns}`} element={<ReturnsReport />} />
                    <Route path={`${paths.reports}/${paths.fixedAssets}`} element={<AP_FixedAssetsReport />} />
                    <Route path={`${paths.reports}/${paths.balanceSheet}`} element={<AP_BalanceSheetReport />} />
                    <Route path={`${paths.reports}/${paths.incomeStatement}`} element={<IncomeStatementReport />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.cash} action={actions.read} />}>
                    <Route path={paths.cash} element={<AP_Cash />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.currencies} action={actions.read} />}>
                    <Route path={paths.currencies} element={<AP_Currencies />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.categories} action={actions.read} />}>
                    <Route path={paths.categories} element={<AP_Categories />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.coupons} action={actions.read} />}>
                    <Route path={paths.coupons} element={<AP_Coupons />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.customization} action={actions.read} />}>
                    <Route path={paths.customization} element={<AP_Customization />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.governorates} action={actions.read} />}>
                    <Route path={paths.governorates} element={<AP_Governorates />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.transactions} action={actions.read} />}>
                    <Route path={paths.transactions} element={<AP_Transactions />} />
                    <Route path={paths.transactions + "/:id"} element={<AP_Transaction />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.users} action={actions.read} />}>
                    <Route path={paths.users} element={<AP_Users />} />
                    <Route path={paths.users + "/:id"} element={<AP_User />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.fixedAssets} action={actions.read} />}>
                    <Route path={paths.fixedAssets} element={<AP_FixedAssets />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.analytics} action={actions.read} />}>
                    <Route path={paths.analytics} element={<AP_Analytics />} />
                  </Route>
                  <Route element={<ResourceGuard resource={resources.shopify} action={actions.read} />}>
                    <Route path={paths.shopifySync} element={<AP_ShopifySync />} />
                  </Route>
                </Route>

                {/* Catch All Admin Routes */}
                <Route path={paths.admin + "/*"} element={<NotFound />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

// export function Maintenance() {
//   const [mounted, setMounted] = useState(false);
//   const { translate } = useLanguage();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-[#f9f9f9] font-[Manrope,sans-serif] text-[#2d3435] selection:bg-[#785a1a33] selection:text-[#2d3435]"
//       style={{ fontFamily: "'Manrope', sans-serif" }}
//     >
//       {/* Google Fonts */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@200;300;400;500;600;700&family=Noto+Kufi+Arabic:wght@100..900&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

//         .material-symbols-outlined {
//           font-family: 'Material Symbols Outlined';
//           font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24;
//           font-style: normal;
//           line-height: 1;
//           letter-spacing: normal;
//           text-transform: none;
//           display: inline-block;
//           white-space: nowrap;
//           word-wrap: normal;
//           direction: ltr;
//         }

//         .font-headline {
//           font-family: 'Noto Serif', 'Noto Kufi Arabic', serif;
//         }

//         @keyframes fade-up {
//           from { opacity: 0; transform: translateY(24px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .fade-up {
//           opacity: 0;
//           animation: fade-up 0.8s ease forwards;
//         }

//         .delay-100 { animation-delay: 0.1s; }
//         .delay-200 { animation-delay: 0.2s; }
//         .delay-300 { animation-delay: 0.3s; }
//         .delay-400 { animation-delay: 0.4s; }
//         .delay-500 { animation-delay: 0.5s; }
//         .delay-600 { animation-delay: 0.6s; }
//       `}</style>

//       <main className="flex min-h-screen w-full flex-col lg:flex-row">
//         {/* Left Side: Image */}
//         <div className="relative h-[50vh] w-full lg:h-screen lg:w-1/2">
//           {mounted && (
//             <div className="fade-up h-full w-full overflow-hidden bg-[#ebeeef] delay-100">
//               <img
//                 src={
//                   "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ6EQfzXCYOnGshft_pCPR-mtBP-_bLftiV6ELDN745kb5V2mNjrVbRDtM9woU1L_s-eIvvyXhAbcVywCSQaM3Vm9akyv5XAIs2Y_qG0hhoyWmuNND5CUvgjZ6D5ZcglzioY9eh4b3RwUi0Kd3RB6iKdxm_DBGRGVe9vs_r3EV_Pst1JU_odlKYeTfdppvOQk-5dABuqeLRU8j0jDbjheWVjZCyCmhPrVvDC4YfK4FTnHU_5dWdavx2U8iu1QH0Yww_tgvPmJ3S5V4"
//                 }
//                 alt="Maintenance"
//                 className="h-full w-full object-cover"
//                 style={{ filter: "grayscale(0.2) contrast(1.1) brightness(0.95)" }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Right Side: Content */}
//         <div className="flex w-full flex-col items-center justify-center bg-[#f9f9f9] px-6 py-16 lg:w-1/2 lg:items-start lg:px-24">
//           {/* Label */}
//           {mounted && (
//             <span
//               className="fade-up mb-8 text-xs uppercase text-[#785a1a] delay-200"
//               style={{ letterSpacing: "0.5em", fontWeight: 500 }}
//             >
//               {translate("Leopard", "ليوبارد")}
//             </span>
//           )}

//           {/* Headline */}
//           {mounted && (
//             <h2
//               className="font-headline fade-up mb-10 text-center font-light leading-[1.1] text-[#2d3435] delay-300 lg:text-start"
//               style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
//             >
//               {translate("We'll Be", "سنعود")} <br />
//               <span style={{ fontWeight: 800 }}>{translate("Back Soon", "عن قريب")}</span>
//             </h2>
//           )}

//           {/* Body Text */}
//           {mounted && (
//             <div className="fade-up delay-400 space-y-6 text-center lg:text-start" style={{ maxWidth: "32rem" }}>
//               <p className="text-lg font-light leading-relaxed text-[#5a6061]">
//                 {translate(
//                   "We're currently improving our system to serve you better. We are curating a collection of timeless pieces for the modern gentleman.",
//                   "نعمل حالياً على تحسين أنظمتنا لتقديم تجربة تليق بكم. نحن بصدد تنسيق مجموعة من القطع الكلاسيكية للرجل العصري.",
//                 )}
//               </p>
//               <p className="text-base leading-relaxed text-[#5a6061]" style={{ opacity: 0.8 }}>
//                 {translate(
//                   "Thank you for your patience during this brief pause in service.",
//                   "نشكر لكم طيب صبركم خلال هذا التوقف المؤقت.",
//                 )}
//               </p>
//             </div>
//           )}

//           {/* Action Buttons & Socials */}
//           {mounted && (
//             <div className="fade-up mt-16 flex flex-col items-center gap-8 delay-500 lg:items-start">
//               {/* WhatsApp Button */}
//               <a
//                 href="https://wa.me/+201011105252"
//                 className="group relative flex items-center gap-4 bg-[#25D366] px-8 py-4 text-[#faf7f6] transition-all hover:bg-[#20BA5A] active:scale-95"
//                 style={{ textDecoration: "none" }}
//               >
//                 <solidIcons.Whatsapp size={25} />
//                 <span className="text-sm font-semibold uppercase" style={{ letterSpacing: "0.1em" }}>
//                   {translate("Contact on WhatsApp", "تواصل معنا عبر واتساب")}
//                 </span>
//               </a>

//               {/* Social Links Section */}
//               <div className="fade-up delay-600 mt-4 flex flex-col items-center gap-4 lg:items-start">
//                 {/* Icons Container */}
//                 <div className="flex items-center gap-5 text-[#2d3435]">
//                   <a
//                     href="https://www.facebook.com/share/1ABgVhyVr5/?mibextid=wwXIfr"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d34351a] transition-all duration-300 hover:bg-[#2d3435] hover:text-[#f9f9f9] hover:shadow-lg"
//                     aria-label="Facebook"
//                   >
//                     <solidIcons.Facebook size={18} />
//                   </a>

//                   <a
//                     href="https://www.instagram.com/leopard.eg?igsh=MThmbm1mbW0zYWVvNQ%3D%3D&utm_source=qr"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d34351a] transition-all duration-300 hover:bg-[#2d3435] hover:text-[#f9f9f9] hover:shadow-lg"
//                     aria-label="Instagram"
//                   >
//                     <solidIcons.Instagram size={18} />
//                   </a>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
