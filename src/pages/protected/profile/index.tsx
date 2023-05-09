import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getServerSideProps } from "@/lib/serverProps";
import Usuario from "@/interfaces/Usuario";
import { useRouter } from "next/router";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import ProfileForm from "@/components/ProfileForm";

export default function changeProfile({ user, jwt }: { user: Usuario, jwt: string }) {
  return (
    <>
      <Navbar usuario={user}></Navbar>
      <div className="md:p-10">
        <Tabs>
          <TabList>
            <Tab>Perfil</Tab>
            <Tab>Seguridad</Tab>
            <Tab>Mis tiendas</Tab>
            <Tab>Mis valoraciones</Tab>
            <Tab>Pedidos realizados</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ProfileForm jwt={jwt} user={user}/>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <Footer />
    </>
  );
}
export { getServerSideProps };
