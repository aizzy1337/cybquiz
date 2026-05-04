# CybQuiz

CybQuiz to webowa aplikacja szkoleniowa do ćwiczenia rozpoznawania ataków socjotechnicznych i phishingu.

Użytkownicy rozwiązują quizy przypisane do grup, a administratorzy zarządzają pytaniami, quizami, grupami i rankingami.

## Co robi aplikacja

- umożliwia tworzenie pytań typu `quiz`, `email`, `sms`, `website`, `social`
- buduje quizy z zestawów pytań
- pozwala przypisywać quizy do wielu grup
- obsługuje dołączanie do grup po kodzie
- zapisuje wyniki i pokazuje ranking zależny od roli

## Role

- `admin`
  - tworzy pytania, quizy i grupy
  - przypisuje quizy do grup
  - widzi ranking członków swoich grup
- `user`
  - dołącza do grup po kodzie
  - rozwiązuje quizy dostępne w wybranej grupie
  - widzi tylko własne wyniki

## Stack technologiczny

- Frontend: React + Vite
- Backend: Java 17, Spring Boot, Spring Cloud Function
- Data store backendu: DynamoDB
- Lokalne środowisko AWS: LocalStack