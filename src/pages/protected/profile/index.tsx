import { getServerSideProps } from "@/lib/serverProps";
import Usuario from "@/interfaces/Usuario";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import ProfileForm from "@/components/ProfileForm";
import SecurityForms from "@/components/SecurityForms";
import MyShops from "@/components/MyShops";
import PlantillaNavFooter from "@/components/plantillas/PlantillaNavFooter";

export default function changeProfile({ user, jwt }: { user: Usuario, jwt: string }) {
  return (
    <PlantillaNavFooter user={user}>
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
              <ProfileForm jwt={jwt} user={user} />
            </TabPanel>
            <TabPanel>
              <SecurityForms user={user} />
            </TabPanel>
            <TabPanel>
              <MyShops jwt={jwt} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </PlantillaNavFooter>
  );
}
export { getServerSideProps };
