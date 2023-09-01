import { setupApp } from "./app";
import { appConfig } from "./config/appConfig";


 function start(){
    const app = setupApp()

    app.listen({port:appConfig.port},(err)=>{
        if(err){
            app.log.error(err)
            process.exit(1)
        }
        app.log.info("Application running on port 3000")
    });
}

start()