'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { formatTime12h } from '@/lib/format-time';
import { normalizeInteractionSeverity, type InteractionSeverity } from '@/lib/types/prescription';
import { PDFBrandLogo } from './pdf/PDFBrandLogo';

/** Matches `app/globals.css` — Roshetta.AI brand */
const BRAND = {
  teal: '#0D4C59',
  tealLight: '#166475',
  green: '#10B981',
  coral: '#FF7E62',
  coralLight: '#FFF1EE',
  bg: '#F8FAFC',
  dark: '#0B3B45',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0f172a',
  red50: '#fef2f2',
  red200: '#fecaca',
  red800: '#991b1b',
  red950: '#450a0a',
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber800: '#92400e',
  amber950: '#451a03',
  white: '#ffffff',
  tealTint10: 'rgba(13, 76, 89, 0.1)',
} as const;

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

const font = (rtl: boolean, bold: boolean) => (rtl ? (bold ? 'CairoBold' : 'Cairo') : bold ? 'OutfitBold' : 'Outfit');

const interactionPalette = (severity: InteractionSeverity) => {
  switch (severity) {
    case 'High':
      return {
        boxBg: BRAND.red50,
        boxBorder: BRAND.red200,
        accent: BRAND.red800,
        body: BRAND.red950,
      };
    case 'Medium':
      return {
        boxBg: BRAND.amber50,
        boxBorder: BRAND.amber200,
        accent: BRAND.amber800,
        body: BRAND.amber950,
      };
    default:
      return {
        boxBg: BRAND.bg,
        boxBorder: BRAND.slate200,
        accent: BRAND.dark,
        body: BRAND.slate700,
      };
  }
};

const getStyles = (isRtl: boolean) => {
  const f = (bold: boolean) => font(isRtl, bold);
  const titleBlockAlign = isRtl ? 'flex-end' : 'flex-start';
  const textStart = isRtl ? 'right' : 'left';
  /** `textTransform: 'uppercase'` breaks Arabic shaping in react-pdf */
  const labelTransform = isRtl ? 'none' : 'uppercase';

  return StyleSheet.create({
    page: {
      paddingTop: 40,
      paddingBottom: 48,
      paddingHorizontal: 40,
      backgroundColor: BRAND.bg,
      fontFamily: f(false),
    },
    brandBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 8,
      backgroundColor: BRAND.teal,
    },
    sheet: {
      flex: 1,
      backgroundColor: BRAND.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: BRAND.slate100,
      padding: 32,
      marginTop: 4,
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: BRAND.slate100,
    },
    /** Must grow so title Text gets a real width (otherwise Arabic stacks per-glyph). */
    headerMain: {
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 0,
      maxWidth: '100%',
      overflow: 'hidden',
    },
    logoMark: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: BRAND.teal,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginRight: isRtl ? 0 : 14,
      marginLeft: isRtl ? 14 : 0,
    },
    logoText: {
      fontSize: 13,
      fontFamily: f(true),
      color: BRAND.white,
      letterSpacing: 0.5,
    },
    headerTitles: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 0,
      alignItems: titleBlockAlign,
      alignSelf: 'stretch',
    },
    title: {
      fontSize: 24,
      fontFamily: f(true),
      color: BRAND.slate900,
      letterSpacing: -0.4,
      textAlign: textStart,
      width: '100%',
    },
    subtitle: {
      fontSize: 9.5,
      fontFamily: f(false),
      color: BRAND.slate500,
      marginTop: 5,
      lineHeight: 1.5,
      textAlign: textStart,
      width: '100%',
    },
    metaBox: {
      flexGrow: 0,
      flexShrink: 0,
      alignSelf: 'center',
      backgroundColor: BRAND.slate50,
      borderWidth: 1,
      borderColor: BRAND.slate100,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      minWidth: 118,
      maxWidth: 200,
      alignItems: 'stretch',
      overflow: 'hidden',
    },
    metaLine: {
      fontSize: 9.5,
      fontFamily: f(false),
      color: BRAND.slate500,
      marginBottom: 4,
      textAlign: textStart,
      width: '100%',
    },
    metaStrong: {
      fontFamily: f(true),
      color: BRAND.slate700,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: f(true),
      color: BRAND.teal,
      marginBottom: 12,
      marginTop: 8,
      paddingBottom: 6,
      borderBottomWidth: 2,
      borderBottomColor: BRAND.green,
      textAlign: textStart,
      letterSpacing: isRtl ? 0 : 0.3,
      textTransform: labelTransform,
      width: '100%',
    },
    medCard: {
      marginBottom: 16,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: BRAND.slate200,
      backgroundColor: BRAND.white,
    },
    medTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
    },
    medIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: BRAND.tealTint10,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginRight: isRtl ? 0 : 12,
      marginLeft: isRtl ? 12 : 0,
    },
    medIcon: {
      fontSize: 12,
      fontFamily: f(true),
      color: BRAND.teal,
    },
    medTextCol: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      minWidth: 0,
    },
    medName: {
      fontSize: 15,
      fontFamily: f(true),
      color: BRAND.slate900,
      textAlign: textStart,
      lineHeight: 1.35,
      width: '100%',
    },
    dosageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
      width: '100%',
    },
    dosageDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: BRAND.green,
      marginRight: isRtl ? 0 : 6,
      marginLeft: isRtl ? 6 : 0,
      flexShrink: 0,
    },
    medDosage: {
      fontSize: 11,
      fontFamily: f(true),
      color: BRAND.teal,
      textAlign: textStart,
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
    },
    remindersBlock: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: BRAND.slate100,
    },
    remindersLabel: {
      fontSize: 8.5,
      fontFamily: f(true),
      color: BRAND.slate400,
      marginBottom: 8,
      textAlign: textStart,
      letterSpacing: isRtl ? 0 : 0.8,
      textTransform: labelTransform,
      width: '100%',
    },
    remindersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    reminderChip: {
      borderWidth: 1,
      borderColor: BRAND.slate100,
      backgroundColor: BRAND.slate50,
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginRight: isRtl ? 0 : 6,
      marginLeft: isRtl ? 6 : 0,
      marginBottom: 6,
      minWidth: 56,
    },
    reminderTime: {
      fontSize: 9,
      fontFamily: f(true),
      color: BRAND.slate900,
      textAlign: textStart,
    },
    reminderLbl: {
      fontSize: 7,
      fontFamily: f(false),
      color: BRAND.slate500,
      marginTop: 2,
      textAlign: textStart,
      maxWidth: 88,
    },
    fieldLabel: {
      fontSize: 8.5,
      fontFamily: f(true),
      color: BRAND.slate400,
      marginBottom: 6,
      marginTop: 12,
      textAlign: textStart,
      letterSpacing: isRtl ? 0 : 0.6,
      textTransform: labelTransform,
      width: '100%',
    },
    usageBox: {
      backgroundColor: BRAND.slate50,
      borderWidth: 1,
      borderColor: BRAND.slate100,
      borderRadius: 12,
      padding: 12,
    },
    medUsage: {
      fontSize: 10.5,
      fontFamily: f(false),
      color: BRAND.slate700,
      lineHeight: 1.6,
      textAlign: textStart,
      width: '100%',
    },
    safetyLabel: {
      fontSize: 8.5,
      fontFamily: f(true),
      color: BRAND.amber800,
      marginBottom: 6,
      marginTop: 12,
      textAlign: textStart,
      letterSpacing: isRtl ? 0 : 0.6,
      textTransform: labelTransform,
      width: '100%',
    },
    medTipBox: {
      padding: 12,
      backgroundColor: BRAND.amber50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: BRAND.amber100,
    },
    medTipText: {
      fontSize: 10,
      color: BRAND.amber950,
      fontFamily: f(false),
      lineHeight: 1.6,
      textAlign: textStart,
      width: '100%',
    },
    interactionBox: {
      marginBottom: 12,
      padding: 16,
      borderRadius: 14,
      borderWidth: 2,
    },
    interactionPill: {
      fontSize: 8.5,
      fontFamily: f(true),
      marginBottom: 8,
      textAlign: textStart,
      letterSpacing: isRtl ? 0 : 0.85,
      textTransform: labelTransform,
      width: '100%',
    },
    interactionText: {
      fontSize: 10.5,
      fontFamily: f(false),
      lineHeight: 1.6,
      textAlign: textStart,
      width: '100%',
    },
    footer: {
      marginTop: 24,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: BRAND.slate100,
    },
    disclaimerTitle: {
      fontSize: 9,
      fontFamily: f(true),
      color: BRAND.coral,
      marginBottom: 8,
      textAlign: textStart,
      letterSpacing: isRtl ? 0 : 0.5,
      textTransform: labelTransform,
      width: '100%',
    },
    disclaimerText: {
      fontSize: 9.5,
      color: BRAND.slate500,
      lineHeight: 1.6,
      textAlign: textStart,
      width: '100%',
    },
    footerTagline: {
      marginTop: 16,
      fontSize: 8.5,
      fontFamily: f(true),
      color: BRAND.tealLight,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
  });
};

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
  summary: string;
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
    disclaimerTitle: string;
    dateLabel: string;
    timeLabel: string;
    footerTagline: string;
    typicalUse: string;
    safetyTip: string;
    remindersHeading: string;
    severityDisplayHigh: string;
    severityDisplayMedium: string;
    severityDisplayLow: string;
    summaryLabel: string;
  };
}

function severityDisplayLabel(severity: InteractionSeverity, labels: MedicalReportProps['labels']) {
  switch (severity) {
    case 'High':
      return labels.severityDisplayHigh;
    case 'Medium':
      return labels.severityDisplayMedium;
    default:
      return labels.severityDisplayLow;
  }
}

export const MedicalReport = ({
  summary,
  medications,
  interactions,
  disclaimer,
  date,
  time,
  locale,
  labels,
}: MedicalReportProps) => {
  const isRtl = locale === 'ar';
  const styles = getStyles(isRtl);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.brandBar} fixed />

        <View style={styles.sheet}>
          {/*
            Always use the same two flex children in DOM order: [headerMain, metaBox].
            RTL uses row-reverse on the header so the date block sits visually on the left
            without relying on Fragments (Yoga can overlap Fragment siblings in some cases).
          */}
          <View style={[styles.header, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <View style={[styles.headerMain, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <PDFBrandLogo isRtl={isRtl} showText={false} />
              <View style={[styles.headerTitles, isRtl ? { direction: 'rtl' } : {}]}>
                <Text style={styles.title}>{labels.reportTitle}</Text>
                <Text style={styles.subtitle}>{labels.reportSubtitle}</Text>
              </View>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLine}>
                <Text style={styles.metaStrong}>{labels.dateLabel}: </Text>
                {date}
              </Text>
              <Text style={[styles.metaLine, { marginBottom: 0 }]}>
                <Text style={styles.metaStrong}>{labels.timeLabel}: </Text>
                {time}
              </Text>
            </View>
          </View>

          {/* Quick Summary Section */}
          {summary ? (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>{labels.summaryLabel}</Text>
              <View style={[styles.usageBox, isRtl ? { direction: 'rtl' } : {}]}>
                <Text style={styles.medUsage}>{summary}</Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>{labels.extractedMeds}</Text>

          {medications.map((med, index) => (
            <View key={index} style={styles.medCard} wrap={false}>
              <View style={[styles.medTopRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={{
                  marginRight: isRtl ? 0 : 12,
                  marginLeft: isRtl ? 12 : 0,
                  transform: 'scale(0.8)',
                }}>
                  <PDFBrandLogo isRtl={isRtl} showText={false} />
                </View>
                <View style={[styles.medTextCol, isRtl ? { direction: 'rtl' } : {}]}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <View style={[styles.dosageRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <View style={styles.dosageDot} />
                    <Text style={styles.medDosage}>{med.dosage}</Text>
                  </View>
                </View>
              </View>

              {med.reminders.length > 0 ? (
                <View style={styles.remindersBlock}>
                  <Text style={styles.remindersLabel}>{labels.remindersHeading}</Text>
                  <View style={[styles.remindersRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    {med.reminders.map((r, ri) => (
                      <View key={`${r.time}-${ri}`} style={styles.reminderChip}>
                        <Text style={styles.reminderTime}>{formatTime12h(r.time, locale)}</Text>
                        {r.label ? <Text style={styles.reminderLbl}>{r.label}</Text> : null}
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              <Text style={styles.fieldLabel}>{labels.typicalUse}</Text>
              <View style={[styles.usageBox, isRtl ? { direction: 'rtl' } : {}]}>
                <Text style={styles.medUsage}>{med.usage}</Text>
              </View>

              {med.tip ? (
                <>
                  <Text style={styles.safetyLabel}>{labels.safetyTip}</Text>
                  <View style={[styles.medTipBox, isRtl ? { direction: 'rtl' } : {}]}>
                    <Text style={styles.medTipText}>{med.tip}</Text>
                  </View>
                </>
              ) : null}
            </View>
          ))}

          {interactions.length > 0 ? (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.sectionTitle}>{labels.drugInteractions}</Text>
              {interactions.map((item, i) => {
                const sev = normalizeInteractionSeverity(item.severity);
                const pal = interactionPalette(sev);
                const pill = severityDisplayLabel(sev, labels);
                return (
                  <View
                    key={i}
                    wrap={false}
                    style={[
                      styles.interactionBox,
                      { backgroundColor: pal.boxBg, borderColor: pal.boxBorder },
                    ]}
                  >
                    <Text style={[styles.interactionPill, { color: BRAND.slate600 }]}>{pill}</Text>
                    <Text
                      style={[
                        styles.interactionText,
                        { color: pal.body },
                        isRtl ? { direction: 'rtl' } : {},
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          <View style={styles.footer} wrap={false}>
            <Text style={styles.disclaimerTitle}>{labels.disclaimerTitle}</Text>
            <Text style={[styles.disclaimerText, isRtl ? { direction: 'rtl' } : {}]}>{disclaimer}</Text>
            <Text style={styles.footerTagline}>{labels.footerTagline}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
