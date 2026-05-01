import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cải tiến 1: Thêm Global Prefix '/api' cho mọi endpoint để khớp với đề bài Cybersoft
  app.setGlobalPrefix('api');

  // Cải tiến 2: Bật ValidationPipe toàn cục để tự động ép kiểu và văng lỗi 400 nếu truyền sai DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field rác không có trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu cố tình truyền dư field
      transform: true, // Tự động ép kiểu (VD: String sang Int)
    }),
  );

  // Cải tiến 3: Setup cấu hình Swagger tự động render giao diện Test
  const config = new DocumentBuilder()
    .setTitle('Airbnb API Capstone')
    .setDescription('Tài liệu API cho dự án Airbnb Clone')
    .setVersion('1.0')
    // Cấu hình Nút bấm ổ khoá (Nhập accessToken) trên giao diện Swagger
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'accessToken',
        name: 'accessToken',
        description: 'Nhập accessToken',
        in: 'header',
      },
      'token',
    )
    // Áp dụng security token cho TẤT CẢ endpoint trong Swagger
    // Endpoint nào không cần token thì vẫn gọi được vì Guard kiểm tra @Public()
    .addSecurityRequirements('token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Đường dẫn truy cập Swagger sẽ là: http://localhost:3000/swagger
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server đang chạy tại: http://localhost:3000`);
  console.log(`📖 Swagger UI: http://localhost:3000/swagger (Dán accessToken vào nút Authorize 🔒)`);
}
bootstrap();
