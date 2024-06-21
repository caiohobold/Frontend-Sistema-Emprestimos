import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginAssoc from './pages/loginAssoc';
import 'bootstrap/dist/css/bootstrap.min.css';
import InitialPage from './pages/initialPage';
import AssocPage from './pages/Assoc';
import RegisterAssoc from './pages/registerAssoc';
import LoginMember from './pages/loginMember';
import HomePage from './pages/homePage';
import EmprestimosPage from './pages/emprestimoPage';
import PerfilPage from './pages/userPage';
import PessoasPage from './pages/pessoas';
import PerfilPessoa from './pages/pessoaPerfil';
import EditPessoa from './pages/editPessoa';
import AddPessoa from './pages/addPessoa';
import EquipamentosPage from './pages/equipamentosPage';
import AddEquip from './pages/addEquip';
import EditEquip from './pages/editEquip';
import AddEmprestimo from './pages/addEmp';
import EditEmp from './pages/editEmp';
import ConfigUserPage from './pages/configUser';
import EditUser from './pages/editUser';
import EditAssoc from './pages/editAssoc';
import AdminConfig from './pages/adminConfig';
import CategPage from './pages/categPage';
import LocalPage from './pages/localPage';

function App() {
  return (
    <div className="App">
      <main className="content">
          <Router>
            <Routes>
              <Route path="/" element={<InitialPage />} />
              <Route exact path="/Associacoes/login" element={<LoginAssoc />}/>
              <Route exact path="/Associacoes/register" element={<RegisterAssoc />}/>
              <Route exact path="/Associacoes" element={<AssocPage />}/>
              <Route exact path="/Usuarios/login" element={<LoginMember />}/>
              <Route exact path="/Usuarios/Inicio" element={<HomePage />}/>
              <Route exact path="/Usuarios/emprestimos" element={<EmprestimosPage />}/>
              <Route exact path="/Usuarios/perfil" element={<PerfilPage />}/>
              <Route exact path="/Usuarios/perfil/info" element={<ConfigUserPage />}/>
              <Route exact path="/Usuarios/perfil/edit/membro" element={<EditUser />}/>
              <Route exact path="/Usuarios/perfil/edit/assoc" element={<EditAssoc />}/>
              <Route exact path="/Usuarios/pessoas" element={<PessoasPage />}/>
              <Route exact path="/pessoa/:id" element={<PerfilPessoa />}/>
              <Route exact path="/pessoa/edit/:id" element={<EditPessoa />}/>
              <Route exact path="/equipamento/edit/:id" element={<EditEquip />}/>
              <Route path="/pessoa/add" element={<AddPessoa />} />
              <Route path="/equipamento/add" element={<AddEquip />} />
              <Route path="/Usuarios/equipamentos" element={<EquipamentosPage />} />
              <Route path="/Emprestimos/add" element={<AddEmprestimo />} />
              <Route exact path="/emprestimos/edit/:id" element={<EditEmp />}/>
              <Route exact path="/Associacao/cadastros" element={<AdminConfig />}/>
              <Route exact path="/Associacao/cadastros/categorias" element={<CategPage />}/>
              <Route exact path="/Associacao/cadastros/locais" element={<LocalPage />}/>
            </Routes>
          </Router>
        </main>
    </div>
  );
}

export default App;
