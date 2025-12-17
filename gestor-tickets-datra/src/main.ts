import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* ================================
     🌐 CORS (NECESARIO PARA EL FRONT)
     ================================ */
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend (Vite)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  /* ================================
     ✅ Validación global de DTOs
     ================================ */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Lanza error si llegan campos extra
      transform: true, // Convierte tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /* ================================
     🚀 Arranque del servidor
     ================================ */
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
}

void bootstrap();
