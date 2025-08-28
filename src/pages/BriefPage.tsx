import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Import all data sources for context
import { getCombinedInfrastructureServices } from '@/api/infrastructure';
import { fetchMonetaryLossData } from '@/api/monetaryLoss';
import { getCompensationSummary } from '@/api/compensation';
import { getAgricultureImpacts } from '@/api/agriculture';
import { getLivestockSummary } from '@/api/livestock';
import { getCampsDetailsByDistrict } from '@/api/camps';
import { getWarehouseDetails } from '@/api/warehouse';
import { getDistrictWiseIncidents } from '@/api/incidents';
import { getDailyDSR } from '@/api/dsr';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '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';

export default function BriefPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your KP Floods AI Assistant. I can help you with questions about flood damage, infrastructure, agriculture, compensation, and recovery efforts. What would you like to know?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all data sources for context
  const { data: infrastructureData } = useQuery({
    queryKey: ['combined-infrastructure'],
    queryFn: getCombinedInfrastructureServices,
    staleTime: 1000 * 60 * 5,
  });

  const { data: monetaryLossData } = useQuery({
    queryKey: ['monetary-loss'],
    queryFn: fetchMonetaryLossData,
    staleTime: 1000 * 60 * 5,
  });

  const { data: compensationData } = useQuery({
    queryKey: ['compensation'],
    queryFn: () => getCompensationSummary(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: agricultureData } = useQuery({
    queryKey: ['agriculture'],
    queryFn: getAgricultureImpacts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: livestockData } = useQuery({
    queryKey: ['livestock'],
    queryFn: getLivestockSummary,
    staleTime: 1000 * 60 * 5,
  });

  const { data: campsData } = useQuery({
    queryKey: ['camps'],
    queryFn: getCampsDetailsByDistrict,
    staleTime: 1000 * 60 * 5,
  });

  const { data: warehouseData } = useQuery({
    queryKey: ['warehouse'],
    queryFn: getWarehouseDetails,
    staleTime: 1000 * 60 * 5,
  });

  const { data: incidentsData } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => getDistrictWiseIncidents(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: dsrData } = useQuery({
    queryKey: ['dsr'],
    queryFn: () => getDailyDSR(new Date().toISOString().split('T')[0]),
    staleTime: 1000 * 60 * 5,
  });

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return `Rs ${(amount / 1_000_000_000).toFixed(2)}B`;
    } else if (amount >= 1_000_000) {
      return `Rs ${(amount / 1_000_000).toFixed(2)}M`;
    } else if (amount >= 1_000) {
      return `Rs ${(amount / 1_000).toFixed(2)}K`;
    }
    return `Rs ${amount.toFixed(2)}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toString();
  };

  const prepareContextData = () => {
    const context = {
      infrastructure: {
        summary: infrastructureData?.infrastructure?.summary,
        districts: infrastructureData?.infrastructure?.data?.slice(0, 10) || []
      },
      monetaryLoss: {
        totalLoss: monetaryLossData?.totalLossInRupees,
        totalLossInBillions: monetaryLossData?.totalLossInBillions,
        categories: monetaryLossData?.categories || []
      },
      compensation: {
        totalCompensation: compensationData?.totalCompensation,
        totalDistricts: compensationData?.totalDistricts,
        totalDeaths: compensationData?.totalDeaths,
        totalInjured: compensationData?.totalInjured,
        totalHousesDamaged: compensationData?.totalHousesDamaged,
        totalCattleLost: compensationData?.totalCattleLost
      },
      agriculture: {
        summary: agricultureData?.summary,
        districtBreakdown: agricultureData?.districtBreakdown?.slice(0, 10) || []
      },
      livestock: {
        summary: livestockData,
        data: livestockData || []
      },
      camps: {
        data: campsData || []
      },
      warehouse: {
        data: warehouseData
      },
      incidents: {
        data: incidentsData || []
      },
      dsr: {
        data: dsrData
      }
    };

    return JSON.stringify(context, null, 2);
  };

  const generatePrompt = (question: string, contextData: string) => {
    return `You are an AI assistant specialized in KP (Khyber Pakhtunkhwa) Floods 2025 data analysis. You have access to comprehensive flood damage and recovery data.

IMPORTANT RESTRICTIONS:
- ONLY answer questions related to KP Floods 2025, flood damage, infrastructure, agriculture, compensation, relief efforts, or recovery data
- If the question is NOT related to floods, disaster management, or the provided data, respond with: "I can only answer questions related to KP Floods 2025 and disaster management. Please ask a question about flood damage, infrastructure, agriculture, compensation, relief efforts, or recovery data."
- Do NOT answer questions about other topics, politics, or unrelated subjects

CONTEXT DATA (KP Floods 2025):
${contextData}

USER QUESTION: ${question}

INSTRUCTIONS:
1. Analyze the provided data to answer the question accurately
2. Use specific numbers and facts from the data
3. Format currency values appropriately (e.g., "Rs 48.61B" for billions)
4. Format large numbers appropriately (e.g., "1.2M" for millions)
5. Provide clear, concise, and helpful responses
6. If the question cannot be answered with the available data, say so clearly
7. Always stay focused on flood-related topics only

Please provide a comprehensive answer based on the available data:`;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const contextData = prepareContextData();
      const prompt = generatePrompt(inputValue.trim(), contextData);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant specialized in KP Floods 2025 data analysis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0].message.content,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again or rephrase your question.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What is the total monetary loss from the floods?",
    "How many houses were damaged?",
    "What is the agriculture impact?",
    "How much compensation has been provided?",
    "Which districts were most affected?",
    "What is the infrastructure damage summary?"
  ];

  return (
    <>
      <style>{`
        .brief-message pre,
        .brief-message code { 
          white-space: pre-wrap; 
        }
        .brief-message pre,
        .brief-message table { 
          overflow-x: auto; 
          display: block; 
        }
        @media (max-width: 1024px) { 
          .brief-message { 
            max-height: 55vh; 
          } 
        }
        @media (max-width: 640px) { 
          .brief-message { 
            max-height: 60vh; 
          } 
        }
      `}</style>
      <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="text-center space-y-2 p-6">
        <p className="text-gray-600">Ask questions about flood damage, infrastructure, agriculture, compensation, and recovery efforts</p>
      </div>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="border-b flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Assistant
          </CardTitle>
        </CardHeader>
        
        {/* Content area with proper scrolling */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full grid grid-rows-[1fr_auto]">
            {/* Thread area */}
            <div className="overflow-y-auto px-4 py-3">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] p-3 rounded-lg overflow-hidden ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className={`text-sm whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-h-[50vh] overflow-y-auto ${
                        message.role === 'assistant' ? 'brief-message' : ''
                      }`}>
                        {message.content}
                      </div>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area - Sticky Footer */}
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about KP Floods 2025..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Suggested Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Suggested Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setInputValue(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Sources Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                infrastructureData ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <p className="text-sm text-gray-600">Infrastructure</p>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                monetaryLossData ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <p className="text-sm text-gray-600">Monetary Loss</p>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                agricultureData ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <p className="text-sm text-gray-600">Agriculture</p>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                compensationData ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <p className="text-sm text-gray-600">Compensation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
} 