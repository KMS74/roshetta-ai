'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register Fonts
Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-W1Q.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'CairoBold',
  src: 'https://fonts.gstatic.com/s/cairo/v31/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5W1Q.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'Outfit',
  src: 'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4E.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'OutfitBold',
  src: 'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4E.ttf',
  fontWeight: 'bold',
});

const getStyles = (isRtl: boolean) => StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: isRtl ? 'Cairo' : 'Outfit',
    direction: isRtl ? 'rtl' : 'ltr',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 20,
    marginBottom: 30,
    flexDirection: isRtl ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
    alignItems: isRtl ? 'flex-end' : 'flex-start',
    maxWidth: '70%',
  },
  title: {
    fontSize: 28,
    fontFamily: isRtl ? 'CairoBold' : 'OutfitBold',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: isRtl ? 'Cairo' : 'Outfit',
    color: '#64748b',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: isRtl ? 'flex-start' : 'flex-end',
  },
  timestamp: {
    fontSize: 9,
    fontFamily: 'Outfit',
    color: '#94a3b8',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: isRtl ? 'CairoBold' : 'OutfitBold',
    color: '#0D4C59',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#10B981',
    paddingBottom: 5,
    textAlign: isRtl ? 'right' : 'left',
  },
  medItem: {
    marginBottom: 20,
    paddingRight: isRtl ? 10 : 0,
    paddingLeft: isRtl ? 0 : 10,
    borderRightWidth: isRtl ? 3 : 0,
    borderRightColor: '#0D4C59',
    borderLeftWidth: isRtl ? 0 : 3,
    borderLeftColor: '#0D4C59',
  },
  medName: {
    fontSize: 14,
    fontFamily: 'OutfitBold',
    color: '#0f172a',
    textAlign: isRtl ? 'right' : 'left',
  },
  medDetails: {
    backgroundColor: '#f8fafc',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  medDosage: {
    fontSize: 12,
    fontFamily: isRtl ? 'CairoBold' : 'OutfitBold',
    color: '#1e293b',
    textAlign: isRtl ? 'right' : 'left',
  },
  medUsage: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
    textAlign: isRtl ? 'right' : 'left',
  },
  medTipBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#fffbeb',
    borderRadius: 4,
    borderLeftWidth: isRtl ? 0 : 2,
    borderLeftColor: '#f59e0b',
    borderRightWidth: isRtl ? 2 : 0,
    borderRightColor: '#f59e0b',
  },
  medTipText: {
    fontSize: 8,
    color: '#92400e',
    fontFamily: isRtl ? 'CairoBold' : 'OutfitBold',
    textAlign: isRtl ? 'right' : 'left',
  },
  interactionBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  interactionHigh: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  interactionMedium: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  interactionNormal: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  interactionTitle: {
    fontSize: 10,
    fontFamily: isRtl ? 'CairoBold' : 'OutfitBold',
    marginBottom: 5,
    textAlign: isRtl ? 'right' : 'left',
  },
  interactionLabel: {
    fontSize: 8,
    fontFamily: 'OutfitBold',
    color: '#94a3b8',
    marginBottom: 2,
    textAlign: isRtl ? 'right' : 'left',
    textTransform: 'uppercase',
  },
  interactionText: {
    fontSize: 10,
    textAlign: isRtl ? 'right' : 'left',
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 30,
  },
  disclaimerTitle: {
    fontSize: 9,
    fontFamily: 'OutfitBold',
    color: '#dc2626',
    marginBottom: 6,
    textAlign: isRtl ? 'right' : 'left',
    textTransform: 'uppercase',
  },
  disclaimerText: {
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 1.5,
    textAlign: isRtl ? 'right' : 'left',
  },
});

interface Medication {
  name: string;
  dosage: string;
  usage: string;
  tip: string;
  reminders: { time: string; label: string }[];
}

interface Interaction {
  severity: string;
  description: string;
}

interface MedicalReportProps {
  medications: Medication[];
  interactions: Interaction[];
  disclaimer: string;
  date: string;
  time: string;
  locale: string;
  labels: {
    reportTitle: string;
    reportSubtitle: string;
    extractedMeds: string;
    drugInteractions: string;
    note: string;
    alert: string;
    emergency: string;
    medium: string;
    low: string;
    interactionDetected: string;
    disclaimerTitle: string;
  };
}

export const MedicalReport = ({ medications, interactions, disclaimer, date, time, locale, labels }: MedicalReportProps) => {
  const isRtl = locale === 'ar';
  const styles = getStyles(isRtl);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{labels.reportTitle}</Text>
            <Text style={styles.subtitle}>{labels.reportSubtitle}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.timestamp}>Date: {date}</Text>
            <Text style={styles.timestamp}>Time: {time}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{labels.extractedMeds}</Text>
        
        {medications.map((med, index) => (
          <View key={index} style={styles.medItem}>
            <Text style={styles.medName}>{med.name}</Text>
            <View style={styles.medDetails}>
              <Text style={styles.medDosage}>{med.dosage}</Text>
              <Text style={styles.medUsage}>{med.usage}</Text>
              {med.tip && (
                <View style={styles.medTipBox}>
                  <Text style={styles.medTipText}>{labels.note}: {med.tip}</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {interactions.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>{labels.drugInteractions}</Text>
            {interactions.map((item, i) => (
              <View 
                key={i} 
                style={[
                  styles.interactionBox, 
                  item.severity.toLowerCase() === 'high' ? styles.interactionHigh : 
                  item.severity.toLowerCase() === 'medium' ? styles.interactionMedium : styles.interactionNormal
                ]}
              >
                <Text style={styles.interactionLabel}>{item.severity} {labels.interactionDetected}</Text>
                <Text style={[
                  styles.interactionTitle,
                  { color: item.severity.toLowerCase() === 'high' ? '#7f1d1d' : item.severity.toLowerCase() === 'medium' ? '#92400e' : '#1e3a8a' }
                ]}>
                  {labels.alert}: {item.severity === 'High' ? labels.emergency : item.severity === 'Medium' ? labels.medium : labels.low}
                </Text>
                <Text style={[
                  styles.interactionText,
                  { color: item.severity.toLowerCase() === 'high' ? '#7f1d1d' : item.severity.toLowerCase() === 'medium' ? '#92400e' : '#1e3a8a' }
                ]}>
                  {item.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.disclaimerTitle}>{labels.disclaimerTitle}</Text>
          <Text style={styles.disclaimerText}>{disclaimer}</Text>
        </View>
      </Page>
    </Document>
  );
};
