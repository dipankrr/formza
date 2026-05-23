// // Dashboard.tsx

// export default function Dashboard() {
    //   const { data: user } = useCurrentUser();
    
    //   return (
        //     <>
        //         <h1>Hello {user?.name}</h1>
        //         <h1>Hello {user?.email}</h1>
        //     </>
        // )}

        
import { useCurrentUser } from "@/hooks/get-current-user";

import {Plus,LayoutTemplate}from "lucide-react";
import { Button }from "@/components/ui/button";
import {SidebarProvider,SidebarTrigger}from "@/components/ui/sidebar";
import { AppSidebar }from "@/components/dashboard/app-sidebar";
import { AnalyticsCards }from "@/components/dashboard/analytics-cards";
import { FormsList }from "@/components/dashboard/forms-list";

export default function Dashboard() {

    const { data: user } = useCurrentUser();

    return (

        <SidebarProvider>

            <AppSidebar />

            <main className="flex-1 p-6 space-y-6">

                <div className="flex justify-between items-center" >
                    <div>
                        <SidebarTrigger />
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <h2 className="font-bold">Welcome {user?.name}</h2>
                    </div>

                    <div className=" flex gap-2">
                        <Button>
                            <LayoutTemplate />
                            Templates
                        </Button>

                        <Button>
                            <Plus />
                            New Form
                        </Button>
                    </div>

                </div>

                <AnalyticsCards />

                <FormsList />

            </main>

        </SidebarProvider>

    )

}

