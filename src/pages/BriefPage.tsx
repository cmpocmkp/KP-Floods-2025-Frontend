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
import { getDailyDSR, computeDSRAggregates } from '@/api/dsr';
import { sendAssistantMessage } from '@/api/assistant';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// No longer need OpenAI API key since we're using our own assistant endpoint

export default function BriefPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
        content: "Hello! I'm your KP D3 AI Assistant powered by the new flexible assistant API. I can help you with questions about damages, disasters, and directories. What would you like to know?",
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
    // Helper function to safely compute DSR aggregates
    const getDSRAggregates = () => {
      try {
        if (dsrData && dsrData.data) {
          return computeDSRAggregates(dsrData);
        }
        return null;
      } catch (error) {
        console.warn('Failed to compute DSR aggregates:', error);
        return null;
      }
    };

    const dsrAggregates = getDSRAggregates();

    const context = {
      infrastructure: {
        summary: infrastructureData?.infrastructure?.summary,
        topDistricts: infrastructureData?.infrastructure?.data?.slice(0, 5) || []
      },
      monetaryLoss: {
        totalLossInBillions: monetaryLossData?.totalLossInBillions,
        topCategories: monetaryLossData?.categories?.slice(0, 8) || []
      },
      compensation: {
        totalCompensation: compensationData?.totalCompensation,
        totalDeaths: compensationData?.totalDeaths,
        totalInjured: compensationData?.totalInjured,
        totalHousesDamaged: compensationData?.totalHousesDamaged,
        totalCattleLost: compensationData?.totalCattleLost,
        agricultureCompensation: {
          type: "Crops per acre",
          compensation: 5000,
          count: 57892.5,
          total: 289462500
        }
      },
      agriculture: {
        summary: agricultureData?.summary,
        topDistricts: agricultureData?.districtBreakdown?.slice(0, 5) || []
      },
      livestock: {
        summary: livestockData
      },
      camps: {
        totalCamps: Array.isArray(campsData) ? campsData.length : 0,
        totalBeneficiaries: Array.isArray(campsData) ? campsData.reduce((sum: number, camp: any) => sum + (camp.beneficiaries || 0), 0) : 0
      },
      warehouse: {
        totalWarehouses: warehouseData ? 1 : 0
      },
      incidents: {
        totalIncidents: Array.isArray(incidentsData) ? incidentsData.length : 0
      },
      dsr: {
        totalReports: dsrData ? 1 : 0,
        topDeaths: dsrAggregates?.rankings?.topDeaths || [],
        totalDeaths: dsrAggregates?.totals?.deaths || 0,
        totalInjured: dsrAggregates?.totals?.injured || 0
      }
    };

    return JSON.stringify(context, null, 1);
  };

  // No longer need generatePrompt function since we're using the new assistant API

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
      
      console.log('Sending request to Flood Assistant API...');

      const response = await sendAssistantMessage({
        prompt: inputValue.trim(),
        data: JSON.parse(contextData),
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        temperature: 0.7
      });

      console.log('Assistant API Response:', response);

      if (!response.success) {
        throw new Error('Assistant API returned an error');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please check the console for more details.`,
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

  // No longer need to test API keys since we're using our own assistant endpoint

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
        <p className="text-gray-600">Ask questions about flood damage, infrastructure, agriculture, compensation, and recovery efforts using the new flexible assistant API</p>
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
                  placeholder="Ask a question about KP D3..."
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