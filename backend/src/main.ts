import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global das rotas
  app.setGlobalPrefix('api');

  // Habilitar CORS para o frontend Angular
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validação automática de formulários/DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Interceptor de formato para respostas
  app.useGlobalInterceptors(new TransformInterceptor());

  // Documentação interativa Swagger OpenAPI
  const config = new DocumentBuilder()
    .setTitle('API de E-Commerce')
    .setDescription('Documentação dos serviços de catálogo, pedidos, carrinho e autenticação')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const porta = process.env.PORT || 3000;
  await app.listen(porta);
  console.log(`🚀 Servidor backend rodando em: http://localhost:${porta}/api`);
  console.log(`📚 Documentação Swagger disponível em: http://localhost:${porta}/api/docs`);
}

bootstrap();
