import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Mountain, Snowflake, Thermometer, Droplets } from "lucide-react";

export default function GLOFModule() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GLOF (Glacial Lake Outburst Flood)</h1>
          <p className="text-gray-600">Glacial Lake Outburst Flood monitoring and assessment system</p>
        </div>
      </div>

        {/* Coming Soon Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Snowflake className="h-6 w-6" />
              GLOF Monitoring System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mountain className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
                The GLOF (Glacial Lake Outburst Flood) monitoring and assessment system is currently under development. 
                This module will provide comprehensive monitoring of glacial lakes and early warning systems for potential outburst floods.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4">Planned Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <Thermometer className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Temperature Monitoring</h5>
                      <p className="text-sm text-gray-600">Real-time glacial temperature tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Water Level Tracking</h5>
                      <p className="text-sm text-gray-600">Glacial lake water level monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Early Warning System</h5>
                      <p className="text-sm text-gray-600">Automated alerts for potential GLOF events</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mountain className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Glacial Mapping</h5>
                      <p className="text-sm text-gray-600">Interactive glacial lake mapping and visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Snowflake className="h-5 w-5" />
                What is GLOF?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                A Glacial Lake Outburst Flood (GLOF) is a type of outburst flood that occurs when the dam containing 
                a glacial lake fails. This can happen due to various factors including glacial melting, ice avalanches, 
                or structural failure of the natural dam.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Why Monitor GLOF?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                GLOF events can cause catastrophic flooding downstream, affecting communities, infrastructure, 
                and ecosystems. Early detection and monitoring systems are crucial for disaster preparedness 
                and risk mitigation in mountainous regions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle>For More Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              For questions about the GLOF monitoring system or to report glacial lake observations, 
              please contact the disaster management team or visit the main KP Floods 2025 dashboard 
              for current flood monitoring capabilities.
            </p>
          </CardContent>
        </Card>
    </div>
  );
}
