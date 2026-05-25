import {
    useParams
}
    from "react-router-dom";

export default function FormEditorPage() {

    const {
        formId
    }
        =
        useParams();

    return (

        <div
            className="
p-6
space-y-4
"
        >

            <h1
                className="
text-3xl
font-bold
"
            >

                Form Builder

            </h1>

            <p>

                Editing:

                {formId}

            </p>

        </div>

    )

}