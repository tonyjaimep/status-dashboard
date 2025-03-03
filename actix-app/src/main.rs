use actix_cors::Cors;
use actix_web::web::Data;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use std::sync::Mutex;
use sysinfo::System;

#[get("/health")]
async fn health(system: Data<Mutex<System>>) -> impl Responder {
    let mut sys = system.lock().unwrap();
    sys.refresh_cpu_all();
    sys.refresh_memory();

    let cpu_usage = sys.global_cpu_usage();
    let memory_usage = sys.used_memory() as f64 / sys.total_memory() as f64 * 100.0;

    HttpResponse::Ok().json(serde_json::json!({
        "status": "OK",
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let system = Data::new(Mutex::new(System::new_all()));

    HttpServer::new(move || {
        App::new()
            .app_data(system.clone())
            .wrap(Cors::permissive())
            .service(health)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
