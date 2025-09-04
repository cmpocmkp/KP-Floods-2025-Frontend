import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MapPin, AlertTriangle, BarChart3, Shield, Users } from "lucide-react";

export default function EarthquakeModule() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-6">
        <Activity className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earthquake Monitoring</h1>
          <p className="text-gray-600">Seismic activity monitoring and earthquake assessment system</p>
        </div>
      </div>

        {/* Coming Soon Card */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Activity className="h-6 w-6" />
              Earthquake Monitoring System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-12 w-12 text-red-600" />
              </div>
              <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
                The Earthquake monitoring and assessment system is currently under development. 
                This module will provide comprehensive seismic monitoring, early warning systems, and damage assessment capabilities for earthquake events.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-red-200">
                <h4 className="font-semibold text-gray-900 mb-4">Planned Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Seismic Monitoring</h5>
                      <p className="text-sm text-gray-600">Real-time earthquake detection and magnitude tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Early Warning System</h5>
                      <p className="text-sm text-gray-600">Automated alerts for seismic activity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Damage Assessment</h5>
                      <p className="text-sm text-gray-600">Post-earthquake impact evaluation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">Community Alerts</h5>
                      <p className="text-sm text-gray-600">Public notification and safety systems</p>
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
                <Activity className="h-5 w-5" />
                Earthquake Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Earthquake monitoring involves the continuous observation of seismic activity using seismometers and other 
                geophysical instruments. This helps in understanding earthquake patterns, predicting potential risks, 
                and providing early warnings to protect communities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Why Monitor Earthquakes?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Earthquake monitoring is crucial for disaster preparedness, early warning systems, and post-event 
                response. It helps in assessing seismic risks, planning infrastructure, and implementing safety 
                measures to minimize loss of life and property damage.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seismic Zones Information */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-900">Seismic Risk in Pakistan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-yellow-800 space-y-3">
              <p>
                Pakistan is located in a seismically active region with several major fault lines, including the 
                Chaman Fault, Main Karakoram Thrust, and Main Boundary Thrust. The country experiences frequent 
                seismic activity, making earthquake monitoring essential for public safety.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded border border-yellow-300">
                  <h5 className="font-semibold text-yellow-900">High Risk Zones</h5>
                  <p className="text-sm text-yellow-700">Northern areas, Balochistan, and parts of Khyber Pakhtunkhwa</p>
                </div>
                <div className="bg-white p-3 rounded border border-yellow-300">
                  <h5 className="font-semibold text-yellow-900">Major Faults</h5>
                  <p className="text-sm text-yellow-700">Chaman, Main Karakoram, Main Boundary Thrust</p>
                </div>
                <div className="bg-white p-3 rounded border border-yellow-300">
                  <h5 className="font-semibold text-yellow-900">Historical Events</h5>
                  <p className="text-sm text-yellow-700">2005 Kashmir, 2013 Balochistan earthquakes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle>For More Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              For questions about the earthquake monitoring system or to report seismic observations, 
              please contact the disaster management team or visit the main KP Floods 2025 dashboard 
              for current disaster monitoring capabilities.
            </p>
          </CardContent>
        </Card>
    </div>
  );
}

