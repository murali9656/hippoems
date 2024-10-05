import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Navbar from './pages/navbar';
import Adminhome from './homes/adminhome';
import Marketing from './employees/marketing';
import Support from './employees/support';
import Company from './companies/company';
import Marketteamhome from './homes/marketteamhome';
import Enquiry from './enquires/enquiry';
import Addenquiry from './enquires/addenquiry';
import Addassets from './assets/addassets';
import Assets from './assets/assets';
import Enquiryedit from './enquires/enquiryedit';
import Versions from './versions/versions';
import Addupdate from './updates/addupdate';
import Annexure from './prints/annexure';
import Reports from './reports/reports';
import Myreport from './reports/myreport';
import Updatelist from './updates/updatelist';
import Coverpage from './prints/coverpage';
import Customreports from './reports/customreports';
import Enquiryedit2 from './authorised/enquiryedit2';
import Authenquiry from './authorised/authenquiry';
import Status from './pages/status';
import Stage from './pages/stage';

function App() {
  const userId = localStorage.getItem('id');
  return (
    <div>
     <BrowserRouter>
     {localStorage.getItem('id')!=="" ? <Navbar/> : ""}
     <Routes>
      {userId === "" || !userId ? <Route path='/' element={<Login/>}></Route>: null}
      {localStorage.getItem('role')==='admin' ? <Route path='/' element={<Adminhome/>}></Route> : <Route path='/' element={<Marketteamhome/>}></Route>}
       <Route path='marketing' element={<Marketing/>}></Route>
       <Route path='support' element={<Support/>}></Route>
       <Route path='company' element={<Company/>}></Route>
       <Route path='marketteamhome' element={<Marketteamhome/>}></Route>
       {localStorage.getItem('role')==="marketing" ? <Route path='enquiry' element={<Enquiry/>}></Route> : <Route path='enquiry' element={<Authenquiry/>}></Route>}
       <Route path='addenquiry' element={<Addenquiry/>}></Route>
       <Route path='addassets' element={<Addassets/>}></Route>
       <Route path='assets' element={<Assets/>}></Route>
       <Route path='enquiryedit' element={<Enquiryedit/>}></Route>
       <Route path='enquiryedit2' element={<Enquiryedit2/>}></Route>
       <Route path='enquiryedit' element={<Enquiryedit/>}></Route>
       <Route path='versions' element={<Versions/>}></Route>
       <Route path='addupdate' element={<Addupdate/>}></Route>
       <Route path='annexure' element={<Annexure/>}></Route>
       <Route path='reports' element={<Reports/>}></Route>
       <Route path='myreport' element={<Myreport/>}></Route>
       <Route path='updatelist' element={<Updatelist/>}></Route>
       <Route path='coverpage' element={<Coverpage/>}></Route>
       <Route path='customreports' element={<Customreports/>}></Route>
       <Route path='status' element={<Status/>}></Route>
       <Route path='stage' element={<Stage/>}></Route>
      </Routes></BrowserRouter>
    </div>
  );
}

export default App;
