import React from 'react';
import { StyleSheet, View } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../routes/AppRoutes';
import { List, Title } from 'react-native-paper';
import CurrencyText from '../../components/CurrencyText/CurrencyText';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useInvestments } from '../../hooks/useInvestments/useInvestments';

type InvestmentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Investments'
>;

type Props = {
  navigation: InvestmentsScreenNavigationProp;
};

function Investments({ navigation }: Props) {
  const { data: investments } = useInvestments();

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
          key={investment.name}
          onPress={() => navigation.navigate('Redemption', { investment })}>
          <List.Item
            style={styles.invesmentItemContainer}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  invesmentItemContainer: {
    backgroundColor: '#fff',
    marginBottom: 2,
  },
});

export default Investments;
