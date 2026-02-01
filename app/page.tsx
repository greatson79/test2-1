"use client";

import { useEffect, useState, useCallback } from "react";

// 상품 타입 정의
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  checked: boolean;
  image: string;
}

// 신혼 가전 더미 데이터
const DUMMY_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "LG 올레드 TV 65인치",
    price: 2450000,
    quantity: 1,
    checked: true,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "삼성 비스포크 로봇청소기",
    price: 890000,
    quantity: 1,
    checked: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "SK매직 식기세척기 12인용",
    price: 750000,
    quantity: 1,
    checked: true,
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "삼성 에어드레서 스타일러",
    price: 1200000,
    quantity: 1,
    checked: true,
    image: "https://images.unsplash.com/photo-1558618047-f4b511d7b7e7?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "LG 광파오븐",
    price: 450000,
    quantity: 1,
    checked: true,
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&h=200&fit=crop",
  },
];

const STORAGE_KEY = "cart_items_v2";
const SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 3000;

// 금액 포맷 함수
function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR");
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage에서 데이터 로드
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems(DUMMY_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_ITEMS));
      }
    } else {
      setItems(DUMMY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_ITEMS));
    }
    setIsLoaded(true);
  }, []);

  // 상태 변경 시 localStorage 저장
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // 개별 선택 토글
  const toggleCheck = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  // 전체 선택/해제
  const toggleAll = useCallback(() => {
    const allChecked = items.every((item) => item.checked);
    setItems((prev) =>
      prev.map((item) => ({ ...item, checked: !allChecked }))
    );
  }, [items]);

  // 수량 증가
  const increaseQuantity = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  // 수량 감소 (최소 1)
  const decreaseQuantity = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }, []);

  // 상품 삭제
  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // 계산 로직
  const checkedItems = items.filter((item) => item.checked);
  const checkedCount = checkedItems.length;
  const itemTotal = checkedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = checkedCount > 0 && itemTotal < SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const totalPayment = itemTotal + shippingFee;
  const freeShippingRemaining = Math.max(0, SHIPPING_THRESHOLD - itemTotal);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">장바구니</h1>
          <p className="text-gray-500 mt-1">
            총 {items.length}개의 상품이 담겨있습니다.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 장바구니 목록 */}
          <div className="flex-1">
            {/* 전체 선택 */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={items.length > 0 && items.every((item) => item.checked)}
                  onChange={toggleAll}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  전체 선택 ({checkedCount}/{items.length})
                </span>
              </label>
            </div>

            {/* 상품 목록 */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    {/* 체크박스 */}
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                      className="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />

                    {/* 상품 이미지 */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* 상품 정보 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {formatPrice(item.price)}원
                      </p>
                      <p className="text-sm text-gray-500">
                        총 {formatPrice(item.price * item.quantity)}원
                      </p>

                      {/* 모바일: 수량 조절 */}
                      <div className="flex items-center gap-2 mt-3 lg:hidden">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-500 hover:text-red-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* 데스크톱: 수량 조절 및 삭제 */}
                    <div className="hidden lg:flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <p className="w-28 text-right font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}원
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                  <p className="text-gray-500">장바구니가 비어있습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg p-6 shadow-sm lg:sticky lg:top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">주문 요약</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="font-medium">{formatPrice(itemTotal)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배송비</span>
                  <span className="font-medium">{formatPrice(shippingFee)}원</span>
                </div>

                {checkedCount > 0 && freeShippingRemaining > 0 && (
                  <div className="bg-blue-50 text-blue-600 text-xs p-3 rounded-lg">
                    {formatPrice(freeShippingRemaining)}원 더 구매하시면 무료배송입니다!
                  </div>
                )}

                <hr className="my-4" />

                <div className="flex justify-between text-base">
                  <span className="font-bold text-gray-900">총 결제 금액</span>
                  <span className="font-bold text-red-500">
                    {formatPrice(totalPayment)}원
                  </span>
                </div>

                <p className="text-xs text-gray-400 text-right">
                  {Math.floor(totalPayment * 0.01)}P 적립 예정
                </p>
              </div>

              <button
                disabled={checkedCount === 0}
                className={`w-full mt-6 py-4 rounded-lg font-bold text-white transition-colors ${
                  checkedCount > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {checkedCount > 0 ? (
                  <>주문하기 ({checkedCount}개)</>
                ) : (
                  <>상품을 선택해주세요</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
