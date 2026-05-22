import {
QueryClient,
QueryClientProvider
}
from "@tanstack/react-query";

import {
httpBatchLink
}
from "@trpc/client";

import { trpc }
from "@/trpc/client";

const queryClient=
new QueryClient();

const client=
trpc.createClient({

links:[

httpBatchLink({

url:
"http://localhost:4000/trpc",

fetch(url,options){

return fetch(
url,
{
...options,
credentials:"include"
}
)

}

})

]

});

export function TRPCProvider({
children
}:{
children:React.ReactNode
}){

return(

<trpc.Provider
client={client}
queryClient={queryClient}
>

<QueryClientProvider
client={queryClient}
>

{children}

</QueryClientProvider>

</trpc.Provider>

)

}