HOOK useGenerateICF:
    IMPORT { generateICF } FROM "api/icfService"
    IMPORT { navigate } FROM "router"

    FUNCTION handleGenerate():
        // Trigger the generation process
        TRY:
            response = CALL generateICF()
            
            IF response.status == "SUCCESS":
                // Navigate to the progress visualization page
                navigate("/icf-creation-generate")
        CATCH error:
            DISPLAY_TOAST("Failed to generate ICF. Please try again.")