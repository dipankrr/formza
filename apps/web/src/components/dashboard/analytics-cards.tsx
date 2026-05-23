import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
}
    from "@/components/ui/card";

const stats = [

    {
        title: "Total Forms",
        value: "12"
    },

    {
        title: "Responses",
        value: "324"
    },

    {
        title: "Views",
        value: "4,231"
    },

    {
        title: "Completion Rate",
        value: "82%"
    }

];

export function AnalyticsCards() {

    return (

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">

            {
                stats.map(stat => (

                    <Card key={stat.title}>

                        <CardHeader>

                            <CardTitle className="text-sm">

                                {stat.title}

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <div className="text-3xl font-bold ">

                                {stat.value}

                            </div>

                        </CardContent>

                    </Card>

                ))
            }

        </div>

    )

}