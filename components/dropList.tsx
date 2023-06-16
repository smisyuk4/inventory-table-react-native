import React, { FC, ReactElement, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  View,
  TextInput,
} from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import Expand_More from '../../assets/expand_more.svg';
import Solar_Pen from '../../assets/solar_pen.svg';
import Check from '../../assets/check.svg';

interface Props {
  label: string;
  data: Array<{ label: string; value: string }>;
  onSelect: (item: { label: string; value: string }) => void;
  isShowBottomItem: boolean;
}

const Dropdown: FC<Props> = ({ label, data, onSelect, isShowBottomItem }) => {
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const [text, onChangeText] = useState('');
  const [isActiveCell, setIsActiveCell] = useState(false);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const toggleActiveCell = (): void => {
    setIsActiveCell(prev => !prev);
  };

  const openDropdown = (): void => {
    DropdownButton.current.measure(
      (
        _fx: number,
        _fy: number,
        _w: number,
        h: number,
        _px: number,
        py: number
      ) => {
        setDropdownTop(py + h);
        setDropdownLeft(_px - _w / 2 + _w / 2);
      }
    );
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <TouchableHighlight
      style={thisStyles.item}
      onPress={() => onItemPress(item)}
      underlayColor="#1D7B331A"
    >
      <View style={thisStyles.item_inner_wrp}>
        <Text style={thisStyles.item_text}>{item.label}</Text>
        <Check
          height={scale(8)}
          width={scale(8)}
          fill={visible ? '#1D7B33' : '#7C7D7E'}
        />
      </View>
    </TouchableHighlight>
  );

  const createItemPress = (value: any): void => {
    console.log('create item', value);
  };

  const renderCreateButton = ({ value }: any): ReactElement<any, any> => (
    <View
      style={
        isActiveCell
          ? { ...thisStyles.create_item, ...thisStyles.create_item_active }
          : { ...thisStyles.create_item }
      }
    >
      <TextInput
        style={thisStyles.input}
        onChangeText={value => {
          console.log(value);
          onChangeText(value);
        }}
        onFocus={toggleActiveCell}
        onBlur={toggleActiveCell}
        value={text}
        placeholder="Quantity"
      />
      <TouchableOpacity
        style={thisStyles.create_button}
        onPress={() => createItemPress(text)}
      >
        <Solar_Pen height={scale(10)} width={scale(10)} fill={'#00B58A'} />
      </TouchableOpacity>
    </View>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={thisStyles.overlay}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              thisStyles.dropdown,
              { top: dropdownTop, left: dropdownLeft },
            ]}
          >
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={isShowBottomItem ? renderCreateButton : null}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={
        visible
          ? { ...thisStyles.button, ...thisStyles.button_active }
          : thisStyles.button
      }
      onPress={toggleDropdown}
    >
      {renderDropdown()}

      <Text style={thisStyles.buttonText}>
        {(!!selected && selected.label) || label}
      </Text>

      <Expand_More
        height={scale(8)}
        width={scale(8)}
        style={
          visible
            ? { transform: [{ rotate: '180deg' }], fill: '#1D7B33' }
            : { fill: '#7C7D7E' }
        }
      />
    </TouchableOpacity>
  );
};

const thisStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(8),
    height: '100%',
  },
  button_active: {
    borderWidth: 1,
    borderColor: '#1D7B33',
  },
  buttonText: {
    flex: 1,
    // fontSize: scale(16),
    textAlign: 'center',
    fontWeight: '400',
    color: '#7C7D7E',
  },
  dropdown: {
    position: 'absolute',
    width: moderateScale(102),
    borderWidth: 1,
    borderColor: '#020A041A',
    borderRadius: 4,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.1,
    backgroundColor: '#fff',
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: moderateScale(35),
    borderBottomWidth: 1,
    borderColor: '#020A041A',
  },
  item_inner_wrp: {
    flexDirection: 'row',
  },
  item_text: {
    flex: 1,
    // fontSize: scale(16),
    fontWeight: '400',
    color: '#7C7D7E',
  },
  create_item: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: moderateScale(35),
  },
  create_item_active: {
    borderWidth: 1,
    borderColor: '#00B58A',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 30,
  },
  create_button: {
    position: 'absolute',
    top: 15,
    right: 7,
  },
});

export default Dropdown;
