# VITEEE Rank Predictor & Mock Test Platform

A comprehensive platform designed by students for students to prepare for the VITEEE entrance exam. This application offers rank prediction based on past trends and a full-fledged mock test environment to practice effectively.

## 🚀 Features

-   **Rank Predictor**: Estimate your potential rank and eligible colleges based on your expected score.
-   **Mock Tests**: Take full-length, timed mock tests that simulate the actual VITEEE exam pattern.
-   **Detailed Analytics**: Track your performance with detailed subject-wise analysis and score history.
-   **Syllabus & Pattern**: Access the complete syllabus and exam pattern for VITEEE 2026.
-   **Mobile Optimized**: Fully responsive design ensuring a seamless experience on all devices.
-   **No Signup Required**: Instant access to mock tests without the hassle of registration.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **Caching**: [Upstash Redis](https://upstash.com/)
-   **Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
-   **Deployment**: [Vercel](https://vercel.com/)

## ⚙️ How It Works

### 1. Question Storage & Retrieval
Questions are stored in a **MongoDB** database, categorized into separate collections for each subject: `maths`, `physics`, `chemistry`, and `apt_eng` (Aptitude & English).

### 2. Exam Generation
When a user starts a mock test, the backend (`/api/mocktest/questions`) dynamically generates a unique question paper. It uses MongoDB's aggregation pipeline with the `$sample` stage to randomly select questions from each subject collection according to the VITEEE pattern (e.g., 40 Math, 35 Physics, 35 Chemistry, 10 Aptitude, 5 English).

### 3. Image Handling & Caching
Many questions contain images (diagrams, equations). To ensure high performance and low latency:
-   **Storage**: Original images are stored in **Cloudflare R2** (an S3-compatible object storage).
-   **Caching**: We use **Upstash Redis** as a caching layer.
    -   When an image is requested, the API first checks Redis.
    -   **Cache Hit**: If found, the image is served directly from Redis (stored as a base64 string), resulting in sub-millisecond response times.
    -   **Cache Miss**: If not found, the image is fetched from Cloudflare R2, served to the user, and simultaneously cached in Redis for future requests (with a 24-hour TTL).
    -   This strategy significantly reduces bandwidth costs and improves load times for users.

### 4. Result Processing
Upon submission, the user's answers are compared against the correct options stored in the database. The score is calculated instantly, and the result is saved to the `test-results` collection in MongoDB for analytics.

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/viteee-rank-predictor.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables in `.env.local`:
    ```env
    MONGODB_URI=your_mongodb_uri
    MONGODB_DB=your_database_name
    UPSTASH_REDIS_REST_URL=your_redis_url
    UPSTASH_REDIS_REST_TOKEN=your_redis_token
    R2_ACCOUNT_ID=your_r2_account_id
    R2_ACCESS_KEY_ID=your_r2_access_key
    R2_SECRET_ACCESS_KEY=your_r2_secret_key
    R2_BUCKET_NAME=your_bucket_name
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_turnstile_key
    TURNSTILE_SECRET_KEY=your_turnstile_secret
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

contact@malabarmatrix.site