import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { StyleSheet, Text, View } from "react-native";

function StyledParagraph({
  parts,
}: {
  parts: { text: string; highlight?: boolean }[];
}) {
  const colors = useTokens();
  const { fontFamily, boldFontFamily, extraBoldFontFamily } = useFont();

  return (
    <Text style={styles.content}>
      {parts.map((part, index) => (
        <Text
          key={index}
          style={
            part.highlight
              ? [
                  styles.title,
                  { fontFamily: boldFontFamily, color: colors.tint },
                ]
              : [styles.content, { fontFamily, color: colors.icon }]
          }
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
}

export default function OnboardingContent({ step }: { step: number }) {
  return (
    <View>
      {step === 1 && (
        <StyledParagraph
          parts={[
            { text: "اجعل من القرآن " },
            { text: "وِردًا", highlight: true },
            { text: " ليومك" },
          ]}
        />
      )}
      {step === 2 && (
        <StyledParagraph
          parts={[
            { text: "وِردك اليومي هو " },
            { text: "عَهدك", highlight: true },
            { text: "، واصل تلاوتك واقرأها قبل الساعة ١١:٥٩ مساءً بتوقيت " },
            { text: "مَكة", highlight: true },
            { text: "." },
          ]}
        />
      )}
      {step === 3 && (
        <StyledParagraph
          parts={[
            {
              text: "التأخير هو خسران للأجر العظيم، في ورد عدم الإلتزام لمدة ",
            },
            { text: "٧ أيام", highlight: true },
            { text: " يعيدك للبدء من نقطة البداية." },
          ]}
        />
      )}
      {step === 4 && (
        <StyledParagraph
          parts={[
            { text: "كل يوم من التلاوة، تكسب " },
            { text: "نقاطًا", highlight: true },
            { text: " و" },
            { text: "أيام تتابع 🔥", highlight: true },
            { text: " ومكافآت تعكس التزامك." },
          ]}
        />
      )}
      {step === 5 && (
        <StyledParagraph
          parts={[
            { text: "القرآن نورك وحجّتك. " },
            { text: "ابدأ", highlight: true },
            { text: " رحلتك مع " },
            { text: "وِرد", highlight: true },
            { text: " واجعله جزءًا لا يتجزأ من يومك." },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    fontSize: 20,
    textAlign: "justify",
    lineHeight: 42,
    paddingVertical: 10,
    textAlignVertical: "top",
    writingDirection: "rtl",
  },
  title: {
    fontSize: 32,
  },
});
