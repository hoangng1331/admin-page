import { Layout } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import numeral from 'numeral';
import 'numeral/locales/vi';
import React from 'react';
import './App.css';
import Employees from './pages/Management/Employees';
import Products from './pages/Management/Products';
import Products1 from './pages/Products';
import Home from './pages/Home';
import MainMenu from './components/MainMenu';
import SearchOrdersByStatus from './pages/Sales/Orders/SearchOrdersByStatus';
import Login from './pages/Login';
import Orders from './pages/Sales/Orders/Orders';
import Categories from './pages/Categories';
import FormUpload from './pages/Upload/FormUpload';
import AntUpload from './pages/Upload/AntUpload';
import ManualAntUpload from './pages/Upload/ManualAntUpload';
import Discount from './pages/Management/Products/Discount';
import ColorForm from './pages/Colors';
import {useAuthStore} from './hooks/useAuthStore'
import {axiosClient} from './libraries/axiosClient'
import OrderForm from './pages/OrderForm';
numeral.locale('vi');

const { Header, Footer, Sider, Content } = Layout;  

function App() {
  const { auth, logout } = useAuthStore((state) => state);
  const userRole = auth?.loggedInUser?.role;
  const [name, setName]=React.useState("");
  React.useEffect((e) => {
    if (auth){
    axiosClient.get("/login/" + auth?.loggedInUser?._id, e).then((response) => {
      setName(response.data.fullName ? response.data.fullName : response.data.name.fullName);
    });}
  }, []);
   return (
   <div style={{}}>
     <BrowserRouter>
     {!auth && (
         <Content style={{ padding: 24 }}>
           <Routes>
             <Route path='/' element={<Login/>} />
             {/* NO MATCH ROUTE */}
             <Route path='*' element={<Login/>} />
           </Routes>
         </Content>
       )}

       {auth && (  
         
         <Layout>
           <Sider theme='dark' style={{ minHeight: '100vh' }}>
             <MainMenu />
           </Sider>
           <Layout>
             <Header style={{ backgroundColor: 'blue' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <h1 style={{ color: 'white' }}> DHIC Online - {auth?.loggedInUser?.role}</h1>
                 <div style={{ display: 'flex', color: 'white' }}>
                   <strong>{name}</strong>
                   <span style={{ marginInline: 8 }}>|</span>
                   <strong
                     style={{ cursor: 'pointer' }}
                     onClick={() => {
                       logout();
                     }}
                   >
                     Log out
                   </strong>
                 </div>
               </div>
             </Header>
            <Content style={{ padding: 24 }}>
              <Routes>
              {userRole === 'Admin' && (
                <>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/categories/:id/products' element={<Products1 />} />
                <Route path='/management/employees' element={<Employees />} />
                <Route path='/management/products' element={<Products />} />
                <Route path='/management/discount' element={<Discount />} />
                <Route path='/management/colors' element={<ColorForm />} />
                {/* SALES */}

                <Route path='/sales/orders' element={<Orders />} />
                <Route path='/sales/ordersform' element={<OrderForm />} />
                <Route path='/sales/orders/status' element={<SearchOrdersByStatus />} />
                <Route path='/upload/form' element={<FormUpload />} />
                <Route path='/upload/antd' element={<AntUpload />} />
                <Route path='/upload/manual-antd' element={<ManualAntUpload />} />
                {/* NO MATCH ROUTE */}
                <Route
                  path='*'
                  element={
                    <main style={{ padding: '1rem' }}>
                      <p>404 Page not found</p>
                    </main>
                  }
                />
                </>
              )}
              {userRole === 'Quản lý' && (
                <>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/categories/:id/products' element={<Products1 />} />
                <Route path='/management/products' element={<Products />} />
                <Route path='/management/discount' element={<Discount />} />
                <Route path='/management/colors' element={<ColorForm />} />
                {/* SALES */}

                <Route path='/sales/ordersform' element={<OrderForm />} />
                <Route path='/sales/orders' element={<Orders />} />
                <Route path='/sales/orders/status' element={<SearchOrdersByStatus />} />
                <Route path='/upload/form' element={<FormUpload />} />
                <Route path='/upload/antd' element={<AntUpload />} />
                <Route path='/upload/manual-antd' element={<ManualAntUpload />} />
                {/* NO MATCH ROUTE */}
                <Route
                  path='*'
                  element={
                    <main style={{ padding: '1rem' }}>
                      <p>404 Page not found</p>
                    </main>
                  }
                />
                </>
              )}
              </Routes>
            </Content>
            <Footer>Footer</Footer>
          </Layout>
        </Layout>
       )}
      </BrowserRouter>
    </div>
  );
}

export default App;
