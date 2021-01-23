import React from 'react';
import { StyleSheet, View } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../routes/AppRoutes';
import { List, Title } from 'react-native-paper';
import CurrencyText from '../../components/CurrencyText/CurrencyText';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Invesment } from '../../api/entities';

type InvestmentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Investments'
>;

type Props = {
  navigation: InvestmentsScreenNavigationProp;
};

function Investments({ navigation }: Props) {
  const investments: Invesment[] = [
    {
      goal: 'Aposentadoria',
      inGracePeriod: false,
      name: 'Investimento I',
      totalBalance: 1000,
      stocks: [
        {
          id: '1',
          percentage: 50,
          symbol: 'BBSA3',
        },
      ],
    },
    {
      goal: 'Aposentadoria',
      inGracePeriod: false,
      name: 'Investimento II',
      totalBalance: 1000000,
      stocks: [
        {
          id: '1',
          percentage: 50,
          symbol: 'BBSA3',
        },
      ],
    },
  ];

  return (
    <View>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Title>Investimentos</Title>
          <Title>R$</Title>
        </View>
        {/* Investments List */}
        {investments.map((investment) => (
          <TouchableOpacity key={investment.name}>
            <List.Item
              style={styles.invesmentItemContainer}
              accessibilityComponentType
              accessibilityTraits
              title={investment.name}
              description={investment.goal}
              right={() => (
                <CurrencyText>{investment.totalBalance}</CurrencyText>
              )}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
