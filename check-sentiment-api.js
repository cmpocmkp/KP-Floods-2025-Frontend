// Simple script to check sentiment data through API
const API_BASE = 'http://localhost:3001';

async function checkSentimentAPI() {
  try {
    console.log('🔍 Checking sentiment data through API...');
    
    // 1. Check articles sentiment distribution
    console.log('\n📊 Checking articles sentiment...');
    const articlesResponse = await fetch(`${API_BASE}/api/articles?limit=1000&hours=24`);
    const articlesData = await articlesResponse.json();
    
    if (articlesData.success) {
      const articles = articlesData.data || [];
      const sentimentCounts = {};
      
      articles.forEach(article => {
        const sentiment = article.sentiment || 'NULL';
        sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
      });
      
      console.log('📰 Articles Sentiment Distribution (Last 24h):');
      Object.entries(sentimentCounts).forEach(([sentiment, count]) => {
        const percentage = ((count / articles.length) * 100).toFixed(1);
        console.log(`  ${sentiment}: ${count} articles (${percentage}%)`);
      });
      
      // Show some recent articles
      console.log('\n📰 Recent Articles with Sentiment:');
      articles.slice(0, 5).forEach((article, index) => {
        console.log(`  ${index + 1}. "${article.title.substring(0, 50)}..."`);
        console.log(`     Source: ${article.source} | Sentiment: ${article.sentiment || 'NULL'}`);
        console.log(`     KP Related: ${article.is_kp_related}`);
        console.log('');
      });
    }
    
    // 2. Check tweets sentiment distribution
    console.log('\n🐦 Checking tweets sentiment...');
    const tweetsResponse = await fetch(`${API_BASE}/tweets?limit=1000&hours=24`);
    const tweetsData = await tweetsResponse.json();
    
    if (tweetsData.success) {
      const tweets = tweetsData.data || [];
      const tweetSentimentCounts = {};
      
      tweets.forEach(tweet => {
        const sentiment = tweet.sentiment || 'NULL';
        tweetSentimentCounts[sentiment] = (tweetSentimentCounts[sentiment] || 0) + 1;
      });
      
      console.log('🐦 Tweets Sentiment Distribution (Last 24h):');
      Object.entries(tweetSentimentCounts).forEach(([sentiment, count]) => {
        const percentage = ((count / tweets.length) * 100).toFixed(1);
        console.log(`  ${sentiment}: ${count} tweets (${percentage}%)`);
      });
    }
    
    // 3. Check sentiment data endpoint
    console.log('\n📊 Checking sentiment analytics...');
    const sentimentResponse = await fetch(`${API_BASE}/api/sentiment-data?hours=24`);
    const sentimentData = await sentimentResponse.json();
    
    if (sentimentData.success) {
      console.log('📈 Sentiment Analytics Data:');
      console.log(JSON.stringify(sentimentData.data, null, 2));
    }
    
    console.log('\n✅ API sentiment check complete!');
    
  } catch (error) {
    console.error('❌ Error checking sentiment API:', error);
    console.log('💡 Make sure the backend server is running on port 3001');
  }
}

checkSentimentAPI(); 