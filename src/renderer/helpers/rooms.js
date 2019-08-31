const data = {
  traditional: {
    name: 'Traditional',
    options: [
      {
        name: 'Living room',
      },
      {
        name: 'Kitchen',
      },
      {
        name: 'Dining',
      },
      {
        name: 'Bedroom',
      },
      {
        name: 'Kid\'s room',
        value: 'Kids bedroom',
      },
      {
        name: 'Bathroom',
      },
      {
        name: 'Nursery',
      },
      {
        name: 'Office',
      },
    ],
  },
  practical: {
    name: 'Practical',
    options: [
      {
        name: 'Toilet',
      },
      {
        name: 'Staircase',
      },
      {
        name: 'Hallway',
      },
      {
        name: 'Laundry room',
      },
      {
        name: 'Storage',
      },
      {
        name: 'Closet',
      },
      {
        name: 'Garage',
      },
      {
        name: 'Other',
      },
    ],
  },
  recreational: {
    name: 'Recreational',
    options: [
      {
        name: 'Gym',
      },
      {
        name: 'Lounge',
      },
      {
        name: 'TV',
      },
      {
        name: 'Computer',
      },
      {
        name: 'Game room',
        value: 'Recreation',
      },
      {
        name: 'Game den',
        value: 'Man cave',
      },
      {
        name: 'Music',
      },
      {
        name: 'Reading',
      },
      {
        name: 'Studio',
      },
    ],
  },
  outdoor: {
    name: 'Outdoor',
    options: [
      {
        name: 'Garden',
      },
      {
        name: 'Terrace',
      },
      {
        name: 'Balcony',
      },
      {
        name: 'Driveway',
      },
      {
        name: 'Carport',
      },
      {
        name: 'Front door',
      },
      {
        name: 'Porch',
      },
      {
        name: 'Barbecue',
      },
      {
        name: 'Pool',
      },
    ],
  },
  levels: {
    name: 'Levels',
    options: [
      {
        name: 'Downstairs',
      },
      {
        name: 'Upstairs',
      },
      {
        name: 'Top floor',
      },
      {
        name: 'Attic',
      },
      {
        name: 'Home',
      },
    ],
  },
};

function createDropDown() {
  Object.keys(data).forEach((item) => {
    data[item].options.forEach((el) => {
      if (!Object.prototype.hasOwnProperty.call(el, 'value')) {
        el.value = el.name;
      }
    });
  });

  return data;
}

const roomDropdown = createDropDown();

export default roomDropdown;
