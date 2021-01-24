import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Headline,
  List,
  Title,
  useTheme,
} from 'react-native-paper';

import { StackNavigationProp } from '@react-navigation/stack';

import { Investment } from '../../api/entities';
import CurrencyText from '../../components/CurrencyText/CurrencyText';
import { useInvestments } from '../../hooks/useInvestments/useInvestments';
import { RootStackParamList } from '../../routes/AppRoutes';

type InvestmentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Investments'
>;

type Props = {
  navigation: InvestmentsScreenNavigationProp;
};

function Investments({ navigation }: Props) {
  const { data: investments, isLoading, error } = useInvestments();
  const { colors } = useTheme();

  const getInvestmentItemBgColor = useCallback(
    (investment: Investment) => {
      return investment.inGracePeriod ? colors.disabled : colors.white;
    },
    [colors.disabled, colors.white],
  );

  const handlePressInvestment = useCallback(
    (investment: Investment) => {
      if (!investment.inGracePeriod) {
        navigation.navigate('Redemption', { investment });
      }
    },
    [navigation],
  );

  if (error) {
    return (
      <View accessibilityRole="alert" style={styles.error}>
        <Headline style={styles.errorText}>
          Algo deu errado, tente novamente mais tarde!
        </Headline>
      </View>
    );
  }

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.accent}
        style={styles.loading}
        accessibilityComponentType
        accessibilityTraits
        animating={true}
      />
    );
  }

  return (
    <ScrollView>
      {/* Header */}
      <View style={styles.header}>
        <Title>Investimentos</Title>
        <Title>R$</Title>
      </View>
      {/* Investments List */}
      {investments.map((investment) => (
        <TouchableOpacity
          accessibilityRole="button"
          disabled={investment.inGracePeriod}
          key={investment.name}
          onPress={() => handlePressInvestment(investment)}>
          <List.Item
            style={[
              styles.invesmentItemContainer,
              {
                backgroundColor: getInvestmentItemBgColor(investment),
              },
            ]}
            accessibilityState={{
              disabled: investment.inGracePeriod,
            }}
            accessibilityComponentType
            accessibilityTraits
            title={investment.name}
            description={investment.goal}
            right={() => <CurrencyText>{investment.totalBalance}</CurrencyText>}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  invesmentItemContainer: {
    marginBottom: 2,
  },
});

export default Investments;
