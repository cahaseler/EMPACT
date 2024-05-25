use actix_web::{web, App, HttpRequest, HttpServer, Responder, HttpResponse};
use dotenv::dotenv;
use std::env;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Serialize, Deserialize)]
struct ApiResponse {
    message: String,
}

async fn handle_request(req: HttpRequest) -> impl Responder {
    let api_key = env::var("API_KEY").expect("API_KEY must be set");
    
    if let Some(key) = req.headers().get("x-api-key") {
        if let Ok(key_str) = key.to_str() {
            if key_str == api_key {
                let endpoint = req.match_info().get("endpoint").unwrap_or("");
                let method = req.method().as_str();
                let file_path = format!("./functions/{}/{}.rs", endpoint, method);

                if Path::new(&file_path).exists() {
                    // Include the file content and execute the handler function
                    let response = match method {
                        "GET" => include_str!(concat!("/functions/", endpoint, "/GET.rs")),
                        "POST" => include_str!(concat!("/functions/", endpoint, "/POST.rs")),
                        "PUT" => include_str!(concat!("/functions/", endpoint, "/PUT.rs")),
                        "DELETE" => include_str!(concat!("/functions/", endpoint, "/DELETE.rs")),
                        _ => return HttpResponse::MethodNotAllowed().json(ApiResponse {
                            message: "Method not allowed".to_string(),
                        }),
                    };

                    // For simplicity, just returning the string directly. 
                    // In a real application, you'd compile and execute the included code.
                    HttpResponse::Ok().json(ApiResponse {
                        message: response.to_string(),
                    })
                } else {
                    HttpResponse::NotFound().json(ApiResponse {
                        message: "Endpoint not found".to_string(),
                    })
                }
            } else {
                HttpResponse::Unauthorized().json(ApiResponse {
                    message: "Invalid API key".to_string(),
                })
            }
        } else {
            HttpResponse::BadRequest().json(ApiResponse {
                message: "Invalid API key format".to_string(),
            })
        }
    } else {
        HttpResponse::BadRequest().json(ApiResponse {
            message: "API key missing".to_string(),
        })
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            .route("/{endpoint}", web::get().to(handle_request))
            .route("/{endpoint}", web::post().to(handle_request))
            .route("/{endpoint}", web::put().to(handle_request))
            .route("/{endpoint}", web::delete().to(handle_request))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
