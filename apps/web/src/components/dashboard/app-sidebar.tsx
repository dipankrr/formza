import {
    LayoutDashboard,
    FileText,
    BarChart3,
    Settings
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
}
    from "@/components/ui/sidebar";

const items = [

    {
        title: "Dashboard",
        icon: LayoutDashboard
    },

    {
        title: "Forms",
        icon: FileText
    },

    {
        title: "Analytics",
        icon: BarChart3
    },

    {
        title: "Settings",
        icon: Settings
    }

];

export function AppSidebar() {

    return (

        <Sidebar>

            <SidebarContent>

                <SidebarGroup>

                    <SidebarGroupContent>

                        <SidebarMenu>

                            {
                                items.map(item => (

                                    <SidebarMenuItem
                                        key={item.title}
                                    >

                                        <SidebarMenuButton>

                                            <item.icon />

                                            <span>
                                                {item.title}
                                            </span>

                                        </SidebarMenuButton>

                                    </SidebarMenuItem>

                                ))
                            }

                        </SidebarMenu>

                    </SidebarGroupContent>

                </SidebarGroup>

            </SidebarContent>

        </Sidebar>

    )

}