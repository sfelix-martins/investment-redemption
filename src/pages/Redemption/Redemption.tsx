import React, { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RouteProp } from '@react-navigation/native';

import CurrencyText from '../../components/CurrencyText/CurrencyText';
import LabelValueItem from '../../components/LabelValueItem/LabelValueItem';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import useDialog from '../../hooks/useDialog/useDialog';
import useRedemption from '../../hooks/useRedemption/useRedemption';
import { RootStackParamList } from '../../routes/AppRoutes';

type RedemptionScreenRouteProp = RouteProp<RootStackParamList, 'Redemption'>;

type Props = {
  route: RedemptionScreenRouteProp;
};

function Redemption({ route }: Props) {
  const { investment } = route.params;
  const {
    hasErrorOnStock,
    getStockError,
    setStockAmountToRedeem,
    totalValue,
    redeem,
    getStockRedemptionValue,
  } = useRedemption();
  const { showErrorDialog, showSuccessDialog } = useDialog();

  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleConfirmRedeemPress = useCallback(() => {
    const redeemedOrError = redeem();

    if (redeemedOrError.isLeft()) {
      return showErrorDialog({
        message: redeemedOrError.value.message,
      });
    }

    showSuccessDialog({
      message: redeemedOrError.value.message,
      actionText: 'Novo resgate',
      title: 'Resgate Efetuado!',
    });
  }, [redeem, showErrorDialog, showSuccessDialog]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({
        ios: 60,
        android: 0,
      })}>
      <View
        style={{
          paddingBottom: insets.bottom + FIXED_BUTTON_HEIGHT,
          backgroundColor: colors.primary,
        }}>
        <ScrollView style={{ backgroundColor: colors.background }}>
          <SectionTitle>Dados do investimento</SectionTitle>
          <LabelValueItem label="Nome" value={investment.name} />
          <LabelValueItem
            label="Saldo total disponível"
            value={
              <CurrencyText withSymbol>{investment.totalBalance}</CurrencyText>
            }
          />
          <SectionTitle>Resgate do seu jeito</SectionTitle>
          <View style={styles.mb16}>
            {investment.stocks.map((stock) => (
              <View key={stock.id} style={styles.mb16}>
                <LabelValueItem label="Ação" value={stock.symbol} />
                <LabelValueItem
                  label="Saldo acumulado"
                  value={
                    <CurrencyText withSymbol>{stock.balance}</CurrencyText>
                  }
                />
                <TextInput
                  style={styles.input}
                  theme={{
                    colors: {
                      primary: colors.accent,
                    },
                  }}
                  error={hasErrorOnStock(stock)}
                  accessibilityComponentType
                  accessibilityTraits
                  accessibilityLabel="Valor a resgatar"
                  label="Valor a resgatar"
                  render={(props) => (
                    <CurrencyInput
                      {...props}
                      onChangeValue={(value: number) => {
                        setStockAmountToRedeem(stock, value);
                      }}
                      value={getStockRedemptionValue(stock) ?? 0}
                      unit="R$ "
                      delimiter="."
                      separator=","
                      precision={2}
                    />
                  )}
                />
                {hasErrorOnStock(stock) && (
                  <HelperText accessibilityRole="alert" type="error">
                    {getStockError(stock)}
                  </HelperText>
                )}
              </View>
            ))}
          </View>
          <LabelValueItem
            style={styles.mb24}
            label="Valor total a resgatar"
            value={<CurrencyText withSymbol>{totalValue}</CurrencyText>}
          />
        </ScrollView>

        <Button
          accessibilityRole="button"
          uppercase
          onPress={handleConfirmRedeemPress}
          style={[
            styles.confirmRedeemButton,
            {
              bottom: insets.bottom,
            },
          ]}
          labelStyle={{
            color: colors.accent,
            ...styles.confirmRedeemButtonLabel,
          }}
          mode="text"
          accessibilityComponentType
          accessibilityTraits>
          Confirmar Resgate
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const FIXED_BUTTON_HEIGHT = 50;

const styles = StyleSheet.create({
  confirmRedeemButton: {
    height: FIXED_BUTTON_HEIGHT,
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  confirmRedeemButtonLabel: {
    fontWeight: 'bold',
  },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  input: { backgroundColor: '#fff', padding: 8 },
});

export default Redemption;
