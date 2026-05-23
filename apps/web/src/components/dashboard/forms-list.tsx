import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
}
    from "@/components/ui/card";

const forms = [

    {
        name: "Customer Survey",
        responses: 45
    },

    {
        name: "Event Registration",
        responses: 12
    },

    {
        name: "Feedback Form",
        responses: 93
    }

];

export function FormsList() {

    return (

        <div className=" grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">

            {
                forms.map(form => (

                    <Card
                        key={form.name}
                    >

                        <CardHeader>

                            <CardTitle>

                                {form.name}

                            </CardTitle>

                        </CardHeader>

                        <CardContent>

                            <p>

                                {form.responses}
                                responses

                            </p>

                        </CardContent>

                    </Card>

                ))
            }

        </div>

    )

}